export class AvatarOverlay extends BMap.Overlay {
    constructor(map, point, img, width = 52, height = 61) {
        super()
        this.img = img
        this.center = point
        this.width = width
        this.height = height
        this.map = map
    }
    init() {}
    initialize() {
        // 创建div元素，作为自定义覆盖物的容器
        let el = document.createElement('div')
        el.style.position = 'absolute'
        // 可以根据参数设置元素外观
        el.style.width = this.width + 'px'
        el.style.height = this.height + 'px'
        el.className = 'avatar-overlay'
        let img = document.createElement('img')
        img.src = this.img || process.env.VUE_APP_IMG_URL + '/default-avatar.png'
        img.className = 'avatar-image'
        el.appendChild(img)
        // 将div添加到覆盖物容器中
        this.map.getPanes().markerPane.appendChild(el)
        // 保存div实例
        this._el = el
        // 需要将div元素作为方法的返回值，当调用该覆盖物的show、
        // hide方法，或者对覆盖物进行移除时，API都将操作此元素。
        return el
    }
    draw() {
        // 根据地理坐标转换为像素坐标，并设置给容器
        let position = this.map.pointToOverlayPixel(this.center)
        this._el.style.left = position.x - this.width / 2 + 'px'
        this._el.style.top = position.y - this.height + 'px'
    }
    show() {
        if (this._el) {
            this._el.style.display = ''
        }
    }
    hide() {
        if (this._el) {
            this._el.style.display = 'none'
        }
    }
}
