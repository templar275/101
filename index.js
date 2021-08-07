/*在移动端处理滑屏事件的时候，需要把文档的默认行为禁止掉  */
$(document).on('touchstart touchmove touchend', function (ev) {
    ev.preventDefault();
})



/* 魔方模块 */
let cubeModule = (function () {
    let $cubeBox = $('.cubeBox');
    let $cube = $('.cube');


    // 记录手指的起始坐标和盒子的旋转角度
    function down(ev) {
        let point = ev.changedTouches[0];
        this.startX = point.clientX;
        this.startY = point.clientY;
        if (!this.rotateX) {
            // 第一次按下设置初始值，以后再按下，按照上次旋转后的角度发生移动即可
            this.rotateX = -30;
            this.rotateY = 45;
        }
        this.isMove = false;
    }

    // 记录手指在x/y轴偏移的值，计算除是否发生移动
    function move(ev) {
        let point = ev.changedTouches[0];
        this.changeX = point.clientX - this.startX;
        this.changeY = point.clientY - this.startY;
        // 如果移动小于偏移值10px防止误差
        if (Math.abs(this.changeX) > 10 || Math.abs(this, this.changeY) > 10) {
            this.isMove = true;
        }
    }


    // 如果发生过移动，我们让盒子在原始的旋转角度上继续旋转
    /*  changeX 控制的是y轴旋转的角度，changeY控制的是x轴旋转角度，并且changeY的值和沿着x轴旋转
    角度的值正好相反（例如：向上移动，changey为负，按照x轴向上旋转是正向角度） */
    function up(ev) {
        let point = ev.changedTouches[0];
        let $this = $(this);
        if (!this.isMove) return;
        this.rotateY = this.rotateY + this.changeX / 2;
        this.rotateX = this.rotateX - this.changeY / 2;
        $this.css(`transform`, `scale(.7) rotateX(${this.rotateX}deg) rotateY(${this.rotateY}deg)`);
    }




    return {
        init(isInit) {
            $cubeBox.css('display', 'block');
            // 如果初始化成功了就不继续执行了
            if(isInit) return;
            $cube.on('touchstart', down);
            $cube.on('touchmove', move);
            $cube.on('touchend', up);
            // 魔方每一面的点击事件
            $cube.children('li').tap(function () {
                $cubeBox.css('display', 'none');
                // 获得点击面的索引加+1
                swiperModule.init($(this).index() + 1)
            })
        }
    }

})();


/* 滑屏模块 */
let swiperModule = (function () {
    // 
    let swiperExample = null,
    $base = null,
    $swiperBox = $('.swiperBox'),
    $return = $('.return');
    
    function pageMove() {
        $base = $('.base');
        // this:swiperExample就是当前实例
        let activeIndex = this.activeIndex,
        slides = this.slides;
        // 第一页3d折叠菜单处理，找到真实的第一张控制动画
        if (activeIndex === 1 || activeIndex === 7) {
            // makisu的基础配置
            $base.makisu({
                selector: 'dd',
                overlap: 0.6,
                speed: 0.8
            });
            $base.makisu('open');
        } else {
            $base.makisu({
                selector: 'dd',
                overlap: 0,
                speed: 0
            });
            $base.makisu('close')
        }
        
        // 给当前页面设置id，让其内容有动画效果
        [].forEach.call(slides, (item, index) => {
            if (index === activeIndex) {
                activeIndex === 0 ? activeIndex = 6 : null;
                activeIndex === 7 ? activeIndex = 1 : null;
                item.id = 'page' + activeIndex;
                return
            }
            item.id = null
        })
        
        
        
        
    }
    
    
    return {
        init(index = 1) {
            $swiperBox.css('display', 'block');
            if(swiperExample){
                swiperExample.slideTo(index, 0);
                return;
            }
            swiperExample = new Swiper('.swiper-container', {
                loop: true,
                effect: 'coverflow',
                on: {
                    init: pageMove,
                    transitionEnd: pageMove
                }
            });
            
            //点击返回 
            $return.tap(function () {
                $swiperBox.css('display', 'none');
                // 传ture是已经初始化成功
                cubeModule.init(true)
            });
        }
    }
    
})();

cubeModule.init();

/* 音乐处理 */
function handleMusic(){
    let $audio=$('.audio'),
        audio=$audio[0],
        $icon=$('.icon');
        $audio.on('canplay',function(){
            $icon.css('display','block').addClass('move')
        });
        $icon.tap(function(){
            // 当前暂定状态，执行播放
            if(audio.paused){
                play();
                $icon.addClass('move');
                return
            }
            // 当前播放状态,执行暂停
            audio.pause();
            $icon.removeClass('move');
        })
    function play(){
        audio.play();
    }
    play();
}
setTimeout(handleMusic,3000);
