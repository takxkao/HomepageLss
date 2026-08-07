/* メニューボタン(三本線)でナビの開閉を切り替える。
   開閉の状態は body の nav-open クラスで持つ。CSS 側はこのクラスを見て
   メニューの表示と、本文を右へ寄せる余白の有無を決めている。 */
document.addEventListener('DOMContentLoaded', function () {
  var toggle = document.querySelector('.nav-toggle');
  var nav = document.getElementById('site-nav');

  if (!toggle || !nav) {
    return;
  }

  function setOpen(isOpen) {
    document.body.classList.toggle('nav-open', isOpen);
    // スクリーンリーダーに開閉状態を伝える
    toggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
  }

  // 本文を右へ寄せる余裕がある画面幅では、初期表示から開いておく。
  // 幅の狭い画面ではメニューが本文に重なってしまうため閉じた状態で始める
  setOpen(window.matchMedia('(min-width: 769px)').matches);

  toggle.addEventListener('click', function () {
    setOpen(!document.body.classList.contains('nav-open'));
  });
});
