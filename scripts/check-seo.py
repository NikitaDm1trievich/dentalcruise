#!/usr/bin/env python3
"""Проверка готовой Astro-сборки: python3 scripts/check-seo.py dist [--site URL]."""
import argparse
import collections
import json
from html.parser import HTMLParser
from pathlib import Path
import re
from urllib.parse import unquote, urljoin, urlsplit
import xml.etree.ElementTree as ET


class Page(HTMLParser):
    def __init__(self, source):
        super().__init__()
        self.title = ''
        self.meta = {}
        self.canonical = []
        self.h1 = 0
        self.links = []
        self.ids = set()
        self.schema = []
        self.assets = []
        self.missing_alt = []
        self.in_title = False
        self.in_schema = False
        self.buffer = ''
        self.feed(source)

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if attrs.get('id'):
            self.ids.add(attrs['id'])
        if tag == 'title':
            self.in_title = True
        if tag == 'h1':
            self.h1 += 1
        if tag == 'meta':
            self.meta[attrs.get('name', '')] = attrs.get('content', '')
        if tag == 'link' and attrs.get('rel') == 'canonical':
            self.canonical.append(attrs.get('href'))
        if tag == 'a' and attrs.get('href'):
            self.links.append(attrs['href'])
        if tag == 'img' and 'alt' not in attrs:
            self.missing_alt.append(attrs.get('src', ''))
        if tag in ['img', 'script', 'source', 'video'] and attrs.get('src'):
            self.assets.append(attrs['src'])
        if tag == 'video' and attrs.get('poster'):
            self.assets.append(attrs['poster'])
        if tag in ['img', 'source'] and 'data:' not in attrs.get('srcset', ''):
            self.assets.extend(item.strip().split()[0] for item in attrs.get('srcset', '').split(',') if item.strip())
        if tag == 'meta' and (attrs.get('property') == 'og:image' or attrs.get('name') == 'twitter:image'):
            self.assets.append(attrs.get('content', ''))
        if tag == 'link' and attrs.get('rel') in ['stylesheet', 'icon', 'apple-touch-icon']:
            self.assets.append(attrs.get('href', ''))
        if tag == 'script' and attrs.get('type') == 'application/ld+json':
            self.in_schema = True
            self.buffer = ''

    def handle_data(self, data):
        if self.in_title:
            self.title += data
        if self.in_schema:
            self.buffer += data

    def handle_endtag(self, tag):
        if tag == 'title':
            self.in_title = False
        if tag == 'script' and self.in_schema:
            self.schema.append(json.loads(self.buffer))
            self.in_schema = False


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('directory', nargs='?', default='dist')
    parser.add_argument('--site', default='https://dentalcruise.ru/')
    parser.add_argument('--staging', action='store_true')
    args = parser.parse_args()
    root = Path(args.directory)
    if not (root / 'index.html').is_file() or not (root / 'robots.txt').is_file():
        print('ERROR: сборка отсутствует или не завершена. Сначала выполните npm run build.')
        return 1
    site = args.site.rstrip('/') + '/'
    base = urlsplit(site).path
    problems = []
    pages = {}
    for path in sorted(root.rglob('*.html')):
        relative = path.relative_to(root).as_posix()
        if relative.startswith('admin/'):
            continue
        try:
            page = Page(path.read_text())
        except (ValueError, json.JSONDecodeError) as error:
            problems.append(f'{relative}: не читается JSON-LD: {error}')
            continue
        is_404 = relative == '404.html'
        route = relative.removesuffix('index.html') if not is_404 else '404/'
        url = urljoin(site, route)
        pages[urlsplit(url).path] = page
        if not page.title.strip() or not page.meta.get('description', '').strip():
            problems.append(f'{relative}: пустой title/description')
        if page.h1 != 1:
            problems.append(f'{relative}: H1={page.h1}, нужен один')
        if page.canonical != [url]:
            problems.append(f'{relative}: canonical {page.canonical}, ожидается {url}')

    if not pages:
        problems.append('HTML-страницы не найдены')
    gallery = f'{base}gallery/'
    has_cases = any(path.startswith(gallery) and path != gallery for path in pages)
    for path, page in pages.items():
        noindex = 'noindex' in page.meta.get('robots', '')
        allowed = args.staging or path.endswith('/404/') or (path == gallery and not has_cases)
        if noindex != allowed:
            problems.append(f'{path}: неверная индексация {page.meta.get("robots")}')
    home = pages.get(base)
    if home:
        days = {'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'}
        businesses = [item for item in home.schema if item.get('@type') == 'Dentist']
        if len(businesses) != 1:
            problems.append('Главная: ожидается одна сущность Dentist')
        for business in businesses:
            for hours in business.get('openingHoursSpecification', []):
                for day in hours.get('dayOfWeek', []):
                    if day.removeprefix('https://schema.org/') not in days:
                        problems.append(f'Некорректный день недели в OpeningHoursSpecification: {day}')
    for field in ['title', 'description']:
        values = collections.defaultdict(list)
        for url, page in pages.items():
            value = page.title if field == 'title' else page.meta.get('description')
            values[value].append(url)
        for value, urls in values.items():
            if len(urls) > 1:
                problems.append(f'Повторяется {field}: {urls}')

    incoming = collections.Counter()
    for source, page in pages.items():
        for image in page.missing_alt:
            problems.append(f'{source}: изображение без атрибута alt: {image}')
        for asset in page.assets:
            target = urlsplit(urljoin(urljoin(site, source), asset))
            if target.netloc == urlsplit(site).netloc and target.path.startswith(base):
                if not (root / unquote(target.path[len(base):])).is_file():
                    problems.append(f'{source}: отсутствует ресурс {asset}')
        for link in page.links:
            target = urlsplit(urljoin(urljoin(site, source), link))
            if target.netloc != urlsplit(site).netloc or not target.path.startswith(base):
                continue
            file = root / unquote(target.path[len(base):])
            if file.is_dir():
                file /= 'index.html'
            if not file.is_file() and target.path not in pages:
                problems.append(f'{source}: ссылка ведёт в отсутствующий файл {link}')
            elif target.path in pages:
                if target.path != source:
                    incoming[target.path] += 1
                if target.fragment and unquote(target.fragment) not in pages[target.path].ids:
                    problems.append(f'{source}: отсутствует якорь {link}')
    for path in pages:
        if path != base and not path.endswith('/404/') and not incoming[path]:
            problems.append(f'{path}: нет входящей ссылки с другой страницы')

    sitemap_urls = set()
    for path in root.glob('sitemap-*.xml'):
        tree = ET.parse(path)
        if tree.getroot().tag.endswith('urlset'):
            sitemap_urls.update(node.text for node in tree.findall('.//{*}loc'))
    expected = {
        urljoin(site, path[len(base):]) for path in pages
        if not path.endswith('/404/') and (path != gallery or has_cases)
    }
    if sitemap_urls != expected:
        problems.append(f'Sitemap: отсутствуют {sorted(expected - sitemap_urls)}, лишние {sorted(sitemap_urls - expected)}')
    robots = (root / 'robots.txt').read_text()
    if args.staging:
        if 'Disallow: /\n' not in robots or 'Sitemap:' in robots:
            problems.append('robots.txt должен закрывать staging и не отдавать Sitemap')
    elif f'Sitemap: {site}sitemap-index.xml' not in robots or 'Disallow: /\n' in robots:
        problems.append('robots.txt: production закрыт или неверен адрес Sitemap')

    # Проверяем смысл цены из CMS против фактической разметки, включая «от».
    for path in Path('src/content/service-pages').glob('[!_]*.json'):
        data = json.loads(path.read_text())
        page = pages.get(f'{base}uslugi/{path.stem}/')
        if not page:
            problems.append(f'{path}: страница услуги не собрана')
            continue
        services = [item for item in page.schema if item.get('@type') == 'Service']
        if len(services) != 1:
            problems.append(f'{path}: ожидается одна сущность Service')
            continue
        price = data.get('price', '')
        digits = re.sub(r'\D', '', price)
        offer = services[0].get('offers', {})
        if digits:
            actual = offer.get('priceSpecification', {}).get('minPrice') if re.match(r'^\s*от\s', price, re.I) else offer.get('price')
            if actual != int(digits):
                problems.append(f'{path.stem}: «{price}» неверно описана в Offer: {offer}')
        elif offer:
            problems.append(f'{path.stem}: числовая цена для услуги без числовой цены')

    for problem in sorted(set(problems)):
        print('ERROR:', problem)
    print(f'Проверено {len(pages)} страниц, {len(sitemap_urls)} URL в sitemap; ошибок: {len(set(problems))}.')
    return bool(problems)


if __name__ == '__main__':
    raise SystemExit(main())
