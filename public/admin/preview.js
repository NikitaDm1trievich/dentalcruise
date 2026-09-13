/**
 * Живой предпросмотр: справа в редакторе показывается настоящая страница
 * сайта, а не список полей, повторяющий форму слева.
 *
 * Как это работает. Шаблон открывает во фрейме опубликованную страницу с
 * меткой ?cms-preview и на каждое изменение записи отправляет ей текущее
 * содержимое. Страница сама находит на себе изменившиеся строки и
 * подставляет новый текст (src/lib/cms-preview.ts). Цвета темы применяются
 * так же, через CSS-переменные.
 *
 * Страница во фрейме — последняя опубликованная версия. Поэтому новые
 * элементы списков, удаления и загруженные картинки видны только после
 * сохранения и пересборки сайта, об этом страница пишет плашкой.
 *
 * Редактор вызывает шаблон по имени файла (для коллекций-файлов) или по
 * имени коллекции (для папок) — см. registerPreviewTemplate внизу.
 * `h` и `createClass` редактор кладёт в window сам, React подключать не нужно.
 */
(function () {
  if (!window.CMS || !window.createClass || !window.h) return;

  var h = window.h;

  /* Корень сайта: редактор лежит в <корень>/admin/. Так адрес верен и на
     GitHub Pages (/dentalcruise/), и на своём домене, и локально. */
  var SITE_ROOT = window.location.origin + window.location.pathname.replace(/admin(\/.*)?$/, '');

  var DESKTOP_WIDTH = 1440;
  var MOBILE_WIDTH = 390;

  function toPlain(value) {
    if (value && typeof value.toJS === 'function') return value.toJS();
    return value || {};
  }

  /** Какую страницу показать для записи. */
  function pageFor(collection, slug, data) {
    switch (collection) {
      case 'doctors':
        return slug ? 'doctors/' + slug + '/' : 'doctors/';
      case 'service-pages':
        return slug ? 'uslugi/' + slug + '/' : 'pricelist/';
      case 'price-list':
        return 'pricelist/' + (data && data.slug ? '#' + data.slug : '');
      case 'cases':
        return 'gallery/';
      default:
        return '';
    }
  }

  function withPreviewFlag(path) {
    var hashAt = path.indexOf('#');
    var base = hashAt < 0 ? path : path.slice(0, hashAt);
    var hash = hashAt < 0 ? '' : path.slice(hashAt);
    return SITE_ROOT + base + '?cms-preview' + hash;
  }

  var SitePreview = window.createClass({
    getInitialState: function () {
      return { device: 'desktop', width: 800, height: 600 };
    },

    componentDidMount: function () {
      // Точка отсчёта — запись в том виде, в каком её открыли: страница во
      // фрейме собрана из этих же данных, от них и считаем изменения.
      this.baseline = this.currentData();
      this.measure = this.measure.bind(this);
      var win = this.props.window || window;
      win.addEventListener('resize', this.measure);
      this.measure();
    },

    componentWillUnmount: function () {
      var win = this.props.window || window;
      win.removeEventListener('resize', this.measure);
    },

    componentDidUpdate: function () {
      this.send(this.currentData());
    },

    measure: function () {
      var doc = this.props.document || document;
      var width = doc.documentElement.clientWidth;
      var height = doc.documentElement.clientHeight;
      if (width !== this.state.width || height !== this.state.height) {
        this.setState({ width: width, height: height });
      }
    },

    collection: function () {
      return this.props.entry.get('collection');
    },

    currentData: function () {
      return toPlain(this.props.entry.get('data'));
    },

    send: function (data) {
      var frame = this.frame;
      if (!frame || !frame.contentWindow) return;
      frame.contentWindow.postMessage(
        { type: 'dc-cms-preview', kind: this.collection() === 'theme' ? 'theme' : 'content', data: data },
        '*',
      );
    },

    onLoad: function () {
      // Сначала исходное состояние, затем текущее: если владелец успел
      // что-то поправить, пока страница грузилась, правка не потеряется.
      this.send(this.baseline);
      this.send(this.currentData());
    },

    render: function () {
      var self = this;
      var data = this.currentData();
      var src = withPreviewFlag(pageFor(this.collection(), this.props.entry.get('slug'), data));

      var mobile = this.state.device === 'mobile';
      var toolbarHeight = 44;
      var available = Math.max(this.state.width, 320);
      var frameWidth = mobile ? MOBILE_WIDTH : DESKTOP_WIDTH;
      // Десктоп уменьшаем целиком, чтобы в узкой колонке была видна именно
      // компьютерная вёрстка, а не мобильная. Телефон показываем 1:1.
      var scale = mobile ? 1 : Math.min(1, available / DESKTOP_WIDTH);
      var frameHeight = (this.state.height - toolbarHeight) / scale;

      function tab(device, label) {
        var active = self.state.device === device;
        return h(
          'button',
          {
            type: 'button',
            onClick: function () {
              self.setState({ device: device });
            },
            style: {
              padding: '6px 12px',
              border: '1px solid ' + (active ? '#00654E' : '#C9D6DA'),
              borderRadius: '8px',
              background: active ? '#00654E' : '#fff',
              color: active ? '#fff' : '#073B4B',
              font: '600 13px/1 system-ui, sans-serif',
              cursor: 'pointer',
            },
          },
          label,
        );
      }

      return h(
        'div',
        { style: { position: 'fixed', inset: 0, display: 'flex', flexDirection: 'column', background: '#E9EFF1' } },
        h(
          'div',
          {
            style: {
              height: toolbarHeight + 'px',
              flex: '0 0 auto',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '0 12px',
              background: '#fff',
              borderBottom: '1px solid #DEEAEC',
              font: '500 13px/1.2 system-ui, sans-serif',
              color: '#3F6270',
            },
          },
          tab('desktop', 'Компьютер'),
          tab('mobile', 'Телефон'),
          h(
            'span',
            { style: { marginLeft: 'auto', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' } },
            'Текст меняется сразу, новые элементы — после публикации',
          ),
        ),
        h(
          'div',
          { style: { flex: '1 1 auto', overflow: 'hidden', display: 'flex', justifyContent: 'center' } },
          h(
            'div',
            { style: { width: frameWidth * scale + 'px', height: frameHeight * scale + 'px', flex: '0 0 auto' } },
            h('iframe', {
              key: src + '|' + this.state.device,
              ref: function (el) {
                self.frame = el;
              },
              src: src,
              title: 'Предпросмотр страницы сайта',
              onLoad: function () {
                self.onLoad();
              },
              style: {
                display: 'block',
                width: frameWidth + 'px',
                height: frameHeight + 'px',
                border: 0,
                background: '#fff',
                transform: 'scale(' + scale + ')',
                transformOrigin: '0 0',
                boxShadow: mobile ? '0 0 0 1px #C9D6DA' : 'none',
              },
            }),
          ),
        ),
      );
    },
  });

  /* Имена файлов из config.yml (для коллекций из одного файла) и имена
     коллекций-папок. Имя «list» у нескольких коллекций общее — шаблон один,
     нужную страницу он выбирает по самой записи. */
  ['palette', 'copy', 'list', 'settings', 'price-list', 'service-pages', 'doctors', 'services', 'cases'].forEach(
    function (name) {
      window.CMS.registerPreviewTemplate(name, SitePreview);
    },
  );
})();
