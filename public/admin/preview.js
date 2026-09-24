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
 * Выбор блока. В режиме «Выбор блоков» страница обводит блок под курсором
 * и по клику присылает сюда, какую запись и какое поле открыть. Поле в
 * открытой записи раскрывает и фокусирует сам редактор (сообщение
 * highlight-editor-field). Поле другой записи — переход в эту запись через
 * список раздела (см. openEntry), поле фокусирует предпросмотр новой записи.
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
  /* Сайт и редактор — один адрес, сообщения ходят только внутри него. */
  var ORIGIN = window.location.origin;

  var DESKTOP_WIDTH = 1440;
  var MOBILE_WIDTH = 390;

  /* Запись и путь поля в сообщении страницы: «home/promos», «items.2.title». */
  var ENTRY = /^[\w-]+\/[^\s:]+$/;
  var PATH = /^[\w.-]*$/;

  var PICK_KEY = 'dc-cms-pick';

  function toPlain(value) {
    if (value && typeof value.toJS === 'function') return value.toJS();
    return value || {};
  }

  /* Файлы-списки главной открываются сразу на своём блоке: id секций
     главной (src/pages/index.astro). Тексты блоков — с верха страницы. */
  var HOME_ANCHORS = {
    promos: 'promo',
    catalog: 'services',
    brands: 'brands',
    comparison: 'why',
    chart: 'why',
    trust: 'trust',
    faq: 'faq',
  };

  /** Какую страницу показать для записи. */
  function pageFor(collection, slug, data) {
    switch (collection) {
      case 'home':
        return HOME_ANCHORS[slug] ? '#' + HOME_ANCHORS[slug] : '';
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

  /* Режим выбора помнится между записями и сессиями. Хранилище может быть
     недоступно (приватное окно, запрет сайта) — тогда просто включён. */
  function readPick() {
    try {
      return window.localStorage.getItem(PICK_KEY) !== 'off';
    } catch (error) {
      return true;
    }
  }

  function writePick(on) {
    try {
      window.localStorage.setItem(PICK_KEY, on ? 'on' : 'off');
    } catch (error) {
      /* не запомнили — не страшно */
    }
  }

  /** Язык формы. Без i18n в config.yml редактор называет его `_default`. */
  function editorLocale() {
    var pane = document.querySelector('.content-editor .pane[data-mode="edit"][data-locale]');
    return (pane && pane.getAttribute('data-locale')) || '_default';
  }

  function fieldElement(path) {
    return document.querySelector(
      '.content-editor .pane[data-mode="edit"][data-locale="' +
        CSS.escape(editorLocale()) +
        '"] .field[data-key-path="' +
        CSS.escape(path) +
        '"]',
    );
  }

  /**
   * Ближайшее к полю место формы, которое уже нарисовано: само поле, его
   * группа или место элемента в списке (обёртка элемента есть сразу, поля
   * внутри появляются, когда до неё докрутят).
   */
  function nearestRendered(path) {
    var parts = path.split('.');
    var found = null;
    for (var length = 1; length <= parts.length; length++) {
      var field = fieldElement(parts.slice(0, length).join('.'));
      if (field) {
        found = field;
        continue;
      }
      if (found && /^\d+$/.test(parts[length - 1])) {
        var list = found;
        var items = [].filter.call(list.querySelectorAll('.item-wrapper'), function (item) {
          return item.parentElement && item.parentElement.closest('.field') === list;
        });
        if (items[Number(parts[length - 1])]) found = items[Number(parts[length - 1])];
      }
      break;
    }
    if (found) return { element: found, block: 'start' };
    // Не нарисовано даже само поле: форма рисуется по мере прокрутки.
    // Докручиваем до конца последнего нарисованного поля верхнего уровня —
    // следующие появятся, и на новой попытке найдётся ближе.
    var fields = document.querySelectorAll('.content-editor .pane[data-mode="edit"] .field[data-key-path]');
    for (var index = fields.length - 1; index >= 0; index--) {
      if (fields[index].getAttribute('data-key-path').indexOf('.') < 0) return { element: fields[index], block: 'end' };
    }
    return null;
  }

  /**
   * Уточнить поле по тексту под курсором. Блок из другой записи страница
   * знает только целиком (`hero`), а нажали, например, на заголовок: ищем
   * внутри блока строку записи, равную этому тексту. Не нашлась или
   * нашлось несколько — открываем блок целиком.
   */
  function refinePath(data, path, text) {
    var needle = (text || '').replace(/\s+/g, ' ').trim();
    if (!needle) return path;
    var node = data;
    var parts = path ? path.split('.') : [];
    for (var i = 0; i < parts.length; i++) {
      if (!node || typeof node !== 'object') return path;
      node = node[parts[i]];
    }
    var found = [];
    (function walk(value, at) {
      if (typeof value === 'string' || typeof value === 'number') {
        if (String(value).replace(/\s+/g, ' ').trim() === needle) found.push(at);
      } else if (value && typeof value === 'object') {
        Object.keys(value).forEach(function (key) {
          walk(value[key], at ? at + '.' + key : key);
        });
      }
    })(node, path);
    return found.length === 1 ? found[0] : path;
  }

  /**
   * У элемента списка (`items.1`) в форме нет своего поля — есть только поля
   * внутри него (`items.1.title`). Курсор ставим в первое из них, когда оно
   * нарисовано; до тех пор ищем по самому элементу, чтобы докрутить к нему.
   */
  function firstInside(path) {
    if (!/(^|\.)\d+$/.test(path) || fieldElement(path)) return path;
    var inner = document.querySelector(
      '.content-editor .pane[data-mode="edit"][data-locale="' +
        CSS.escape(editorLocale()) +
        '"] .field[data-key-path^="' +
        CSS.escape(path + '.') +
        '"]',
    );
    return inner ? inner.getAttribute('data-key-path') : path;
  }

  /**
   * Раскрыть, прокрутить к полю открытой записи и поставить в него курсор.
   * Раскрывает и фокусирует сам редактор, но поля за пределами экрана он
   * рисует, только когда до них докрутят: свёрнутая группа раскрывается, а
   * поля внутри ещё нет, и редактор его не находит. Тогда подкручиваем к
   * ближайшему нарисованному предку и просим ещё раз.
   */
  function focusField(requested, attempt) {
    if (!requested) return;
    var path = firstInside(requested);
    window.postMessage({ type: 'highlight-editor-field', payload: { locale: editorLocale(), keyPath: path } }, ORIGIN);
    window.setTimeout(function () {
      var field = fieldElement(path);
      if (field && field.contains(document.activeElement)) return;
      if ((attempt || 0) >= 8) {
        // Поле нарисовано, но редактор так и не поставил курсор: ставим сами,
        // в тот же элемент, что выбрал бы он.
        var wrapper = field && field.querySelector('.field-wrapper');
        var control =
          wrapper &&
          (wrapper.querySelector('[contenteditable="true"], [tabindex="0"]') ||
            wrapper.querySelector('input, textarea, button'));
        if (control) control.focus();
        return;
      }
      var near = nearestRendered(path);
      if (near) near.element.scrollIntoView({ block: near.block });
      focusField(requested, (attempt || 0) + 1);
    }, 200);
  }

  /* Поле, которое нужно открыть после перехода в другую запись: его
     фокусирует предпросмотр новой записи, когда форма уже на месте. */
  var pendingField = null;

  /** Сменить адрес редактора так же, как это делает он сам: история + hashchange. */
  function route(path, replace) {
    var base = window.location.origin + window.location.pathname + window.location.search;
    var from = base + window.location.hash;
    var to = base + '#' + path;
    window.history[replace ? 'replaceState' : 'pushState']({ from: from }, '', to);
    window.dispatchEvent(new HashChangeEvent('hashchange', { oldURL: from, newURL: to }));
  }

  /**
   * Перейти в другую запись и открыть там поле.
   *
   * Прямой переход из открытой записи в другую редактор не дорисовывает:
   * адрес и заголовок меняются, а форма остаётся пустой. Поэтому идём, как
   * человек: сначала в список раздела, и, когда форма закрылась, в нужную
   * запись. Промежуточный шаг заменяется в истории, и «Назад» ведёт в
   * прежнюю запись, а не в список.
   *
   * Пометку highlight в history.state, которую редактор умеет читать сам,
   * не ставим: с ней форма новой записи на проверке не отрисовалась. Поле
   * фокусирует onLoad предпросмотра новой записи через pendingField.
   */
  function openEntry(entry, path, text) {
    var at = entry.indexOf('/');
    var collection = '/collections/' + entry.slice(0, at);
    var target = collection + '/entries/' + entry.slice(at + 1);
    // Путь бывает пустым (блок — вся запись): тогда поле найдётся по тексту.
    pendingField = path || text ? { entry: entry, path: path, text: text } : null;

    route(collection);
    var started = Date.now();
    (function waitForList() {
      if (document.querySelector('.content-editor') && Date.now() - started < 3000) {
        window.setTimeout(waitForList, 50);
        return;
      }
      route(target, true);
    })();
  }

  /* ── Подписи для рамки выбора ─────────────────────────────────────────
     Подпись над блоком повторяет подписи формы слева, поэтому берётся из
     того же config.yml, а не из отдельной таблицы, которая разошлась бы с
     конфигом при первой правке. Разбор рассчитан на стиль этого файла:
     блочные списки `- name: …` и однострочные `{ name: …, label: … }`;
     из них нужны только name, label и label_singular. */

  function unquote(value) {
    var text = value.trim();
    if (text.charAt(0) === "'") return text.slice(1, text.lastIndexOf("'")).replace(/''/g, "'");
    if (text.charAt(0) === '"') return text.slice(1, text.lastIndexOf('"'));
    return text.replace(/\s+#.*$/, '');
  }

  /** `{ name: title, label: Заголовок, widget: string }` → объект. */
  function readFlowMap(text) {
    var body = text.trim().replace(/^\{/, '').replace(/\}$/, '');
    var result = {};
    var depth = 0;
    var quote = '';
    var start = 0;
    function take(end) {
      var part = body.slice(start, end);
      var colon = part.indexOf(':');
      if (colon > 0) {
        var key = part.slice(0, colon).trim();
        var value = part.slice(colon + 1).trim();
        if (value.charAt(0) === '{') result[key] = readFlowMap(value);
        else if (value.charAt(0) !== '[') result[key] = unquote(value);
      }
      start = end + 1;
    }
    for (var i = 0; i < body.length; i++) {
      var char = body.charAt(i);
      if (quote) {
        if (char === quote) quote = '';
      } else if (char === "'" || char === '"') {
        quote = char;
      } else if (char === '{' || char === '[') {
        depth++;
      } else if (char === '}' || char === ']') {
        depth--;
      } else if (char === ',' && depth === 0) {
        take(i);
      }
    }
    take(body.length);
    return result;
  }

  function readConfig(text) {
    var root = {};
    var stack = [{ node: root, indent: 0, key: null }];
    var blockIndent = -1;

    function top() {
      return stack[stack.length - 1];
    }

    function key(frame, column, name, value) {
      frame.key = null;
      if (value === '' || value === undefined) {
        frame.key = name;
      } else if (/^[>|]/.test(value)) {
        blockIndent = column;
      } else if (value.charAt(0) === '{') {
        frame.node[name] = readFlowMap(value);
      } else if (value.charAt(0) !== '[') {
        frame.node[name] = unquote(value);
      }
    }

    text.split(/\r?\n/).forEach(function (raw) {
      var column = raw.search(/\S/);
      if (column < 0) return;
      if (blockIndent >= 0) {
        if (column > blockIndent) return;
        blockIndent = -1;
      }
      var line = raw.slice(column);
      if (line.charAt(0) === '#') return;

      var item = /^-(\s+|$)(.*)$/.exec(line);
      var pair = /^([A-Za-z_][\w-]*):(?:\s+(.*))?$/.exec(line);
      if (!item && !pair) return;

      while (stack.length > 1 && top().indent > column) stack.pop();
      var parent = top();

      if (item) {
        if (!parent.key) return;
        if (!Array.isArray(parent.node[parent.key])) parent.node[parent.key] = [];
        var node = {};
        parent.node[parent.key].push(node);
        var inner = column + 1 + item[1].length;
        var frame = { node: node, indent: inner, key: null };
        stack.push(frame);
        var rest = item[2];
        var innerPair = /^([A-Za-z_][\w-]*):(?:\s+(.*))?$/.exec(rest);
        if (rest.charAt(0) === '{') Object.assign(node, readFlowMap(rest));
        else if (innerPair) key(frame, inner, innerPair[1], innerPair[2]);
        return;
      }

      // Вложенный объект: ключ глубже, чем ключи текущего.
      if (column > parent.indent) {
        if (!parent.key) return;
        var nested = {};
        parent.node[parent.key] = nested;
        parent.key = null;
        parent = { node: nested, indent: column, key: null };
        stack.push(parent);
      }
      if (column === parent.indent) key(parent, column, pair[1], pair[2]);
    });
    return root;
  }

  /** Только то, что нужно подписи: имена, подписи и вложенность полей. */
  function labelTree(node) {
    var out = {};
    ['name', 'label', 'label_singular'].forEach(function (name) {
      if (typeof node[name] === 'string') out[name] = node[name];
    });
    ['files', 'fields'].forEach(function (name) {
      if (Array.isArray(node[name])) out[name] = node[name].map(labelTree);
    });
    if (node.field && typeof node.field === 'object') out.field = labelTree(node.field);
    return out;
  }

  var labelsRequest = null;
  function loadLabels() {
    if (!labelsRequest) {
      labelsRequest = window
        .fetch('config.yml', { cache: 'no-cache' })
        .then(function (response) {
          return response.ok ? response.text() : '';
        })
        .then(function (text) {
          var collections = readConfig(text).collections;
          return Array.isArray(collections) ? collections.map(labelTree) : [];
        })
        .catch(function () {
          return [];
        });
    }
    return labelsRequest;
  }

  var SitePreview = window.createClass({
    getInitialState: function () {
      // Ссылка на фрейм — одна функция на всё время жизни: новая на каждой
      // отрисовке вызывалась бы React-ом повторно и сбрасывала готовность.
      this.setFrame = this.setFrame.bind(this);
      return { device: 'desktop', width: 800, height: 600, pick: readPick() };
    },

    componentDidMount: function () {
      // Точка отсчёта — запись в том виде, в каком её открыли: страница во
      // фрейме собрана из этих же данных, от них и считаем изменения.
      this.baseline = this.currentData();
      this.measure = this.measure.bind(this);
      this.onMessage = this.onMessage.bind(this);
      this.onFocus = this.onFocus.bind(this);
      var win = this.props.window || window;
      win.addEventListener('resize', this.measure);
      // Страница во фрейме пишет своему родителю — окну предпросмотра.
      win.addEventListener('message', this.onMessage);
      document.addEventListener('focusin', this.onFocus);
      this.addFocusStyle();
      this.measure();
    },

    componentWillUnmount: function () {
      var win = this.props.window || window;
      win.removeEventListener('resize', this.measure);
      win.removeEventListener('message', this.onMessage);
      document.removeEventListener('focusin', this.onFocus);
    },

    componentDidUpdate: function () {
      this.send(this.currentData());
      this.sendView();
    },

    /* Кнопки панели рисуются в окне предпросмотра без стилей сайта:
       заметная рамка фокуса для клавиатуры задаётся здесь. */
    addFocusStyle: function () {
      var doc = this.props.document;
      if (!doc || doc.getElementById('dc-preview-style')) return;
      var style = doc.createElement('style');
      style.id = 'dc-preview-style';
      style.textContent = 'button:focus-visible{outline:2px solid #00654E;outline-offset:2px}';
      doc.head.appendChild(style);
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

    /** Открытая запись как в data-cms на сайте: «home/texts», «doctors/terapevt». */
    entryId: function () {
      var route = /^#\/collections\/([^/?#]+)\/entries\/([^?#]+)/.exec(window.location.hash);
      if (route) return decodeURIComponent(route[1]) + '/' + decodeURIComponent(route[2]);
      var slug = this.props.entry.get('slug');
      return slug ? this.collection() + '/' + slug : null;
    },

    currentData: function () {
      return toPlain(this.props.entry.get('data'));
    },

    isTheme: function () {
      return this.collection() === 'theme';
    },

    /* Масштаб десктопа во фрейме: страница делит на него рамку и подпись. */
    scale: function () {
      if (this.state.device === 'mobile') return 1;
      return Math.min(1, Math.max(this.state.width, 320) / DESKTOP_WIDTH);
    },

    post: function (message) {
      var frame = this.frame;
      if (!frame || !frame.contentWindow) return;
      message.type = 'dc-cms-preview';
      frame.contentWindow.postMessage(message, ORIGIN);
    },

    send: function (data) {
      this.post({ kind: this.isTheme() ? 'theme' : 'content', entry: this.entryId(), data: data });
    },

    /** Масштаб и режим выбора — только когда они поменялись. */
    sendView: function (force) {
      if (!this.ready) return;
      var scale = this.scale();
      var pick = this.state.pick && !this.isTheme();
      if (force || scale !== this.sentScale) this.post({ kind: 'scale', scale: scale });
      if (force || pick !== this.sentPick) this.post({ kind: 'pick', on: pick });
      this.sentScale = scale;
      this.sentPick = pick;
    },

    onMessage: function (event) {
      var frame = this.frame;
      if (!frame || event.source !== frame.contentWindow || event.origin !== ORIGIN) return;
      var message = event.data;
      if (!message || typeof message !== 'object') return;

      if (message.type === 'dc-cms-ready') {
        // Страница готова: сначала исходное состояние, затем текущее —
        // если владелец успел что-то поправить, пока она грузилась, правка
        // не потеряется.
        var self = this;
        this.ready = true;
        this.sendView(true);
        loadLabels().then(function (tree) {
          if (self.frame === frame) self.post({ kind: 'labels', tree: tree });
        });
        this.send(this.baseline);
        this.send(this.currentData());
        if (pendingField && pendingField.entry === this.entryId()) {
          focusField(refinePath(this.currentData(), pendingField.path, pendingField.text));
          pendingField = null;
        }
        return;
      }

      if (message.type === 'dc-cms-pick') {
        var entry = message.entry;
        var path = message.path;
        if (typeof entry !== 'string' || !ENTRY.test(entry) || typeof path !== 'string' || !PATH.test(path)) return;
        if (entry === this.entryId()) {
          focusField(path);
          return;
        }
        var dirty = JSON.stringify(this.baseline) !== JSON.stringify(this.currentData());
        if (
          dirty &&
          !window.confirm(
            'В этой записи есть несохранённые правки. Перейти в другую запись? ' +
              'Редактор сохранит черновик в браузере и предложит восстановить его, когда вы вернётесь.',
          )
        ) {
          return;
        }
        openEntry(entry, path, typeof message.text === 'string' ? message.text : '');
      }
    },

    /* Поле в форме получило фокус — страница обводит его блок. */
    onFocus: function (event) {
      if (!this.ready || !event.target || typeof event.target.closest !== 'function') return;
      var field = event.target.closest('.content-editor .pane[data-mode="edit"] .field[data-key-path]');
      if (field) this.post({ kind: 'focus', path: field.getAttribute('data-key-path') });
    },

    /* Новый фрейм (другая запись или вкладка) ещё не готов к сообщениям. */
    setFrame: function (el) {
      this.frame = el;
      this.ready = false;
      this.sentScale = this.sentPick = undefined;
    },

    togglePick: function () {
      var pick = !this.state.pick;
      writePick(pick);
      this.setState({ pick: pick });
    },

    render: function () {
      var self = this;
      var data = this.currentData();
      var id = this.entryId();
      var slug = id ? id.slice(id.indexOf('/') + 1) : this.props.entry.get('slug');
      var src = withPreviewFlag(pageFor(this.collection(), slug, data));

      var mobile = this.state.device === 'mobile';
      var toolbarHeight = 44;
      var frameWidth = mobile ? MOBILE_WIDTH : DESKTOP_WIDTH;
      // Десктоп уменьшаем целиком, чтобы в узкой колонке была видна именно
      // компьютерная вёрстка, а не мобильная. Телефон показываем 1:1.
      var scale = this.scale();
      var frameHeight = (this.state.height - toolbarHeight) / scale;

      function button(active, label, onClick, extra) {
        var props = {
          type: 'button',
          onClick: onClick,
          style: {
            padding: '6px 12px',
            border: '1px solid ' + (active ? '#00654E' : '#C9D6DA'),
            borderRadius: '8px',
            background: active ? '#00654E' : '#fff',
            color: active ? '#fff' : '#073B4B',
            font: '600 13px/1 system-ui, sans-serif',
            cursor: 'pointer',
            whiteSpace: 'nowrap',
          },
        };
        for (var name in extra) props[name] = extra[name];
        return h('button', props, label);
      }

      function tab(device, label) {
        return button(self.state.device === device, label, function () {
          self.setState({ device: device });
        });
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
          // В «Цветах сайта» выбирать нечего: форма — одна палитра.
          this.isTheme()
            ? null
            : button(
                this.state.pick,
                'Выбор блоков',
                function () {
                  self.togglePick();
                },
                {
                  'aria-pressed': this.state.pick ? 'true' : 'false',
                  title: 'Нажмите на блок справа — слева откроется его поле',
                },
              ),
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
              // Запись в ключе: другая запись — новая страница с чистой точкой отсчёта.
              key: src + '|' + this.state.device + '|' + this.entryId(),
              ref: this.setFrame,
              src: src,
              title: 'Предпросмотр страницы сайта',
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
     коллекций-папок. Все файлы «Главной» показывают главную; нужную
     страницу для папок шаблон выбирает по самой записи (pageFor). */
  [
    'palette',
    'settings',
    'texts',
    'promos',
    'catalog',
    'brands',
    'comparison',
    'chart',
    'trust',
    'faq',
    'price-list',
    'service-pages',
    'doctors',
    'cases',
  ].forEach(function (name) {
    window.CMS.registerPreviewTemplate(name, SitePreview);
  });
})();
