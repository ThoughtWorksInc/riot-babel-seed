import riot from 'riot'
import $ from 'jquery'
import deviceHelper from '../../utils/device-helper'
import 'slick-carousel'

export default function (opts = {}) {

  this.images = opts.images || []
  this.$images = []

  this.freshActiveIdx = ()=> {
    this.activeIdx = riot.router.current.query.activeIdx || 0
  }

  const itemClassName = 'gallery-slide__item'

  this.initialSlide = (images = [], initialSlide = 0)=> {

    if (images.length) {

      this.$slick = $(this.root).find('.gallery-slide__wrapper')

      images.forEach((src)=> {
        const $img = $('<img class="gallery-image"/>').attr('data-lazy', src)
        const $slideItem = $('<div />').addClass(itemClassName).html($img)
        this.$slick.append($slideItem)
        this.$images.push($img)
      })

      this.centerAllImages()

      this.$slick.slick({
        mobileFirst: true,
        initialSlide: initialSlide,
        infinite: false,
        arrows: true,
        appendArrows: this.$root.find('.gallery-slide__nav'),
        prevArrow: this.$root.find('.gallery-slide__nav > .slick-prev'),
        nextArrow: this.$root.find('.gallery-slide__nav > .slick-next'),
        dots: false
      })
        .on('afterChange', (event, slick, currentSlide)=> {
          this.activeIdx = currentSlide
          slick.$slidesCache.each(function (index) {
            if (Math.abs(currentSlide - index) <= 1) {
              $(this).find('img[data-lazy]').each(function () {
                const $image = $(this)
                $image.attr('src', $image.attr('data-lazy')).removeAttr('data-lazy')
              })
            }
          })
          opts.on_slide_end && opts.on_slide_end(this.activeIdx, this.activeIdx === initialSlide)
        })
        .on('edge', (event, slick, direction) => {
          opts.on_edge && opts.on_edge(direction === 'left' ? 'next' : 'prev')
        });


      // for the initial trigger
      this.$slick.slick('slickGoTo', initialSlide, true)


      if (deviceHelper.isMobile()) {
        this.$slick.on('click', ()=> {
          global.history && global.history.go(-1)
        })
      }

    }

  }

  this.destroySlide = ()=> {
    if (this.$slick) {
      this.$slick.slick('unslick')
      this.$slick.empty()
    }
  }

  this.centerAllImages = ()=> {

    const width = this.$root.width()
    const height = this.$root.height()

    this.$images.forEach(($image)=> {

      $image.hide()

      if ($image.data('loaded')) {
        centerImage($image)
        $image.show()
      }

      $image.on('load', ()=> {
        centerImage($image)
        $image.data('loaded', true)
        $image.show()
      })

    })

    function centerImage($image) {

      const naturalWidth = $image.get(0).naturalWidth
      const naturalHeight = $image.get(0).naturalHeight

      const shouldFillHeight = width / height > naturalWidth / naturalHeight

      if (shouldFillHeight) {

        const resizedWidth = naturalWidth / naturalHeight * height

        $image.css({
          position: 'absolute',
          top: 0,
          left: (width - resizedWidth) / 2,
          height: '100%',
          width: resizedWidth
        })

      } else {

        const resizedHeight = naturalHeight / naturalWidth * width

        $image.css({
          position: 'absolute',
          top: (height - resizedHeight) / 2,
          left: 0,
          height: 'auto',
          width: '100%'
        })

      }
    }
  }

  this.parseActiveIdx = ()=> {
    return this.activeIdx === 'last' ? (this.images.length - 1) : parseInt(this.activeIdx)
  }

  this.on('update', ()=> {
    if (JSON.stringify(this.images) !== JSON.stringify(opts.images)) {
      this.images = opts.images || []
      this.freshActiveIdx()
      this.destroySlide()
      this.initialSlide(this.images, this.parseActiveIdx())
    }
  })

  this.on('mount', ()=> {
    $(window).on('resize orientationchange', this.centerAllImages)
    this.$root = $(this.root)
    this.freshActiveIdx()
    this.initialSlide(this.images, this.parseActiveIdx())
  })

  this.on('unmount', ()=> {
    this.destroySlide()
    $(window).off('resize orientationchange', this.centerAllImages)
  })

}
