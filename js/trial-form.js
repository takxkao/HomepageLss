/* 体験申込フォームの送信。
   入力内容を Google Apps Script のウェブアプリへ送り、
   スプレッドシートへの記録と教室への通知メールは、そちら側で行う。

   セットアップ手順とApps Script側のコードは
   _dev-notes/trial-form-setup.md にまとめてある。 */
document.addEventListener('DOMContentLoaded', function () {

  /* Apps Script を「ウェブアプリとしてデプロイ」したときに発行されるURL。
     デプロイをやり直してURLが変わったときは、ここだけ書き替える。
     (末尾は必ず /exec。/dev で終わるURLは自分しか開けないので使わないこと) */
  var ENDPOINT = 'https://script.google.com/macros/s/AKfycbyyBLFwVL2mCnxO2cKRpAnJI7e8KwLw9F640Tz8YvL5F5xwxtFLbqIWkPFp3RYuzpsxxw/exec';

  var TEL = '0284-55-6127';

  var form = document.getElementById('trial-form');
  var done = document.getElementById('form-done');
  var error = document.getElementById('form-error');
  var submit = document.getElementById('form-submit');

  if (!form || !done || !error || !submit) {
    return;
  }

  function showError(message) {
    error.textContent = message;
    error.hidden = false;
    submit.disabled = false;
    submit.textContent = 'この内容で申し込む';
  }

  function hideError() {
    error.hidden = true;
  }

  form.addEventListener('submit', function (event) {
    event.preventDefault();
    hideError();

    // 参加日は「どれか1つ以上」が必要。この条件はHTMLの required では書けないため、
    // ブラウザ任せにせずここで確かめる
    var dates = [].filter.call(
      form.querySelectorAll('input[name="dates"]'),
      function (input) { return input.checked; }
    ).map(function (input) { return input.value; });

    if (dates.length === 0) {
      showError('参加できる日程を1つ以上お選びください。');
      form.querySelector('input[name="dates"]').focus();
      return;
    }

    /* 入力欄は form.elements 経由で取り出す。form.name のように直接書くと、
       フォーム自身が持つ name プロパティの方が優先されて中身が取れない */
    var fields = form.elements;

    // botよけの隠し欄。人には見えないので、入力があれば自動投稿とみなす。
    // 送信できたように見せて、実際には送らない
    if (fields.address.value !== '') {
      form.hidden = true;
      done.hidden = false;
      return;
    }

    if (ENDPOINT.indexOf('ここにデプロイURLを貼る') !== -1) {
      showError('フォームの設定が未完了です。お手数ですが ' + TEL + ' までお電話ください。');
      return;
    }

    submit.disabled = true;
    submit.textContent = '送信しています…';

    // URLSearchParams で送ると、Apps Script 側で e.parameter.name のように受け取れる。
    // FormData で送ると受け取れないので変えないこと
    var body = new URLSearchParams();
    body.append('dates', dates.join(' / '));
    body.append('name', fields.name.value);
    body.append('email', fields.email.value);
    body.append('tel', fields.tel.value);
    body.append('message', fields.message.value);

    fetch(ENDPOINT, { method: 'POST', body: body })
      .then(function (response) { return response.json(); })
      .then(function (result) {
        if (!result.ok) {
          throw new Error(result.error || 'unknown');
        }
        form.hidden = true;
        done.hidden = false;
        done.focus();
      })
      .catch(function () {
        showError(
          '送信できませんでした。通信の状態をご確認のうえ、もう一度お試しください。' +
          '繰り返し失敗する場合は ' + TEL + ' までお電話ください。'
        );
      });
  });
});
