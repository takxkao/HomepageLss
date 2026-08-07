/* 在校生ページの簡易パスワード。
   合言葉として使う程度のもので、本格的な認証ではありません。
   このファイルは誰でも開けるため、パスワードも中身も見ようと思えば見られます。
   人に見られて困る情報は、このページに載せないでください。 */
document.addEventListener('DOMContentLoaded', function () {
  var PASSWORD = 'lss54321';
  var KEY = 'lss-members-unlocked';

  var form = document.getElementById('lock-form');
  var input = document.getElementById('lock-password');
  var error = document.getElementById('lock-error');
  var gate = document.getElementById('member-gate');
  var content = document.getElementById('member-content');

  if (!form || !input || !gate || !content) {
    return;
  }

  function unlock() {
    gate.hidden = true;
    content.hidden = false;
  }

  // 一度入力したら、そのタブを閉じるまでは再入力なしで見られるようにする
  try {
    if (sessionStorage.getItem(KEY) === 'yes') {
      unlock();
    }
  } catch (e) {
    // プライベートモードなどで sessionStorage が使えない場合は毎回入力してもらう
  }

  form.addEventListener('submit', function (event) {
    event.preventDefault();

    if (input.value !== PASSWORD) {
      error.hidden = false;
      input.value = '';
      input.focus();
      return;
    }

    error.hidden = true;

    try {
      sessionStorage.setItem(KEY, 'yes');
    } catch (e) {
      // 保存できなくても、このページを見る分には問題ない
    }

    unlock();
  });
});
