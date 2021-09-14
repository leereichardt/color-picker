interface MoveableCache {
  x: number;
  y: number;
}

import { on, off } from '../utils/utils';

export default class Moveable {
  private readonly tapStartBinding;
  private readonly tapStopBinding;
  private readonly tapMoveBinding;

  private static DEFAULT_OPTIONS = {
    lock: null,
    onchange: (): number => 0,
    onstop: (): number => 0,
  };
  private readonly options;
  private cache: MoveableCache = {
    x: 0,
    y: 0,
  };
  private wrapperBoundingClient: any;

  constructor(options) {
    this.options = {
      ...Moveable.DEFAULT_OPTIONS,
      ...options,
    };

    this.tapStartBinding = this.tapstart.bind(this);
    this.tapStopBinding = this.tapstop.bind(this);
    this.tapMoveBinding = this.tapmove.bind(this);

    on([this.options.wrapper, this.options.element], 'mousedown', this.tapStartBinding);
    on([this.options.wrapper, this.options.element], 'touchstart', this.tapStartBinding, {
      passive: false,
    });

    on(document, ['keydown', 'keyup'], this.keyboard.bind(this));
  }

  private clamp = (v): number => Math.max(Math.min(v, 1), 0)

  private keyboard(e): void {
    const { type, key } = e;

    // Check to see if the Movable is focused and then move it based on arrow key inputs
    // For improved accessibility
    if (document.activeElement === this.options.wrapper) {
      const { lock } = this.options;
      const up = key === 'ArrowUp';
      const right = key === 'ArrowRight';
      const down = key === 'ArrowDown';
      const left = key === 'ArrowLeft';

      if (type === 'keydown' && (up || right || down || left)) {
        let xm;
        let ym = 0;

        if (lock === 'v') {
          xm = up || right ? 1 : -1;
        } else if (lock === 'h') {
          xm = up || right ? -1 : 1;
        } else {
          ym = 0;
          if (up) {
            ym = -1;
          } else if (down) {
            ym = 1;
          }
          xm = 0;
          if (left) {
            xm = -1;
          } else if (right) {
            xm = 1;
          }
        }

        this.update(this.clamp(this.cache.x + 0.01 * xm), this.clamp(this.cache.y + 0.01 * ym));
        e.preventDefault();
      } else if (key.startsWith('Arrow')) {
        this.options.onstop();
        e.preventDefault();
      }
    }
  }

  private tapstart(evt): void {
    this.wrapperBoundingClient = this.options.wrapper.getBoundingClientRect();
    on(document, ['mouseup', 'touchend', 'touchcancel'], this.tapStopBinding);
    on(document, ['mousemove', 'touchmove'], this.tapMoveBinding);

    if (evt.cancelable) {
      evt.preventDefault();
    }

    const event = new CustomEvent('start');
    this.options.element.dispatchEvent(event);

    // Trigger
    this.tapmove(evt);
  }

  private tapmove(evt): void {
    let x: number;
    let y: number;
    if (evt) {
      const touch = evt && evt.touches && evt.touches[0];
      x = evt ? (touch || evt).clientX : 0;
      y = evt ? (touch || evt).clientY : 0;

      if (Moveable.outsideLeftBounds(x, this.wrapperBoundingClient)) {
        x = this.wrapperBoundingClient.left;
      } else if (Moveable.outsideRightBounds(x, this.wrapperBoundingClient)) {
        x = this.wrapperBoundingClient.left + this.wrapperBoundingClient.width;
      }
      if (Moveable.outsideTopBounds(y, this.wrapperBoundingClient)) {
        y = this.wrapperBoundingClient.top;
      } else if (Moveable.outsideBottomBounds(y, this.wrapperBoundingClient)) {
        y = this.wrapperBoundingClient.top + this.wrapperBoundingClient.height;
      }

      // Normalize (Set x/y to coords inside wrapper)
      x -= this.wrapperBoundingClient.left;
      y -= this.wrapperBoundingClient.top;
    } else {
      x = this.cache.x * this.wrapperBoundingClient.width;
      y = this.cache.y * this.wrapperBoundingClient.height;
    }

    if (this.options.lock !== 'h') {
      this.options.element.style.left = `calc(${ (x / this.wrapperBoundingClient.width) * 100 }% - ${ this.options.element.offsetWidth / 2 }px)`;
    }

    if (this.options.lock !== 'v') {
      this.options.element.style.top = `calc(${ (y / this.wrapperBoundingClient.height) * 100 }% - ${ this.options.element.offsetHeight / 2 }px)`;
    }

    this.cache = {
      x: x / this.wrapperBoundingClient.width,
      y: y / this.wrapperBoundingClient.height
    };
    const cx = this.clamp(this.cache.x);
    const cy = this.clamp(this.cache.y);

    const event = new CustomEvent('change', {
      detail: {
        x: cx,
        y: cy,
      }
    });
    this.options.element.dispatchEvent(event);
  }

  private static outsideBottomBounds = (y: number, wrappingBoundingRect): boolean => y > wrappingBoundingRect.top + wrappingBoundingRect.height;
  private static outsideTopBounds = (y: number, wrappingBoundingRect): boolean => y < wrappingBoundingRect.top;
  private static outsideRightBounds = (x: number, wrappingBoundingRect): boolean => x > wrappingBoundingRect.left + wrappingBoundingRect.width;
  private static outsideLeftBounds = (x: number, wrappingBoundingRect): boolean => x < wrappingBoundingRect.left;

  private tapstop(): void {
    this.options.onstop();
    off(document, ['mouseup', 'touchend', 'touchcancel'], this.tapStopBinding);
    off(document, ['mousemove', 'touchmove'], this.tapMoveBinding);

    const event = new CustomEvent('stop');
    this.options.element.dispatchEvent(event);
  }

  trigger(): void {
    this.tapmove(null);
  }

  update(xPos = 0, yPos = 0): void {
    const x = xPos;
    let y = this.options.lock === 'h' ? x : yPos;
    const { left, top, width, height } = this.options.wrapper.getBoundingClientRect();

    this.tapmove({
      clientX: left + width * x,
      clientY: top + height * y,
    });
  }

  destroy(): void {
    off(document, ['keydown', 'keyup'], this.keyboard.bind(this));
    off([this.options.wrapper, this.options.element], 'mousedown', this.tapstart.bind(this));
    off([this.options.wrapper, this.options.element], 'touchstart', this.tapstart.bind(this), {
      passive: false,
    });
  }
}
