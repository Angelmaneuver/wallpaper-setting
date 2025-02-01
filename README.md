<div align="right">

[日本語](#日本語版)

</div>

<div align="center" style="text-align:center;">
	<h1><i>Wallpaper Setting</i></h1>
	<p><i>VSCode like a crystal clear.</i></p>
	<div>
		<img alt="Version" src="https://img.shields.io/visual-studio-marketplace/v/angelmaneuver.wallpaper-setting?color=blue" />
		<img alt="Language" src="https://img.shields.io/badge/Language-en%2Cja-brightgreen?logo=Language">
		<img alt="Installs" src="https://img.shields.io/visual-studio-marketplace/i/Angelmaneuver.wallpaper-setting" />
		<a href="https://github.com/Angelmaneuver/wallpaper-setting/issues">
			<img alt="Issues" src="https://img.shields.io/github/issues/Angelmaneuver/wallpaper-setting?color=#86D492" />
		</a>
	</div>
</div>

<br />

_CODE, IMAGE, AND UI_

<font size="7"><span style="font-size:3.45rem;"><b><i>Let’s be clear.<br />It’s brilliant.</i></b></span></font>

![Let’s be clear. It’s brilliant.](docs/images/readme01.png)

_The **Wallpaper Setting** is a sight to behold, with support for can be **transparent for only background** and vividness unmatched by other background setting extensions. UI and images pop with rich contrast and sharp detail, and code appears supercrisp for easy reading._

<font size="7"><span style="font-size:3.45rem;"><b><i>Sacrificing nothing.</i></b></span></font>

<table width="100%">
  <tr>
    <th width="50%"><img src="docs/images/readme02.png" /></th>
    <th width="50%"><img src="docs/images/readme03.png" /></th>
  </tr>
  <tr>
    <td width="50%"><div align="center"><i><font size="3.5"><span style="font-size:1.15rem;">Wallpaper Setting</span></font><br />Opacity 0.4%</i></div></td>
    <td width="50%"><div align="center"><i><font size="3.5"><span style="font-size:1.15rem;">Other Extensions</span></font><br />Opacity 0.4% (0.6%)</i></div></td>
  </tr>
</table>

_As a result of research **allowing only the background to be transparent**, it provides a **vivid editor that other extensions cannot reach**._

<font size="7"><span style="font-size:3.45rem;"><b><i>It is a piece of cake.</i></b></span></font>

![It is a piece of cake.](docs/images/readme04.gif)

_**Setting the background with Wallpaper Setting is a piece of cake**. Press `⇧⌘P` to bring up the command pallete and typing the `Wallpaper Setting`, and perform the `Optimize`, image or video setup._

<font size="7"><span style="font-size:3.45rem;"><b><i>As you like.</i></b></span></font>

![As you like.](docs/images/readme05.gif)

_With Wallpaper Setting, **transparency can be set for VSCode parts**. Set the transparency of the parts to your satisfaction!_

<font size="7"><span style="font-size:3.45rem;"><b><i>Let's Install Wallpaper Setting and get your VSCode just the way you like it!</i></b></span></font>

<details><summary><i>Detailed Specifications</i></summary>

### _Wallpaper - Image_

_Set the background image._

| _Name_      | _Required_ | _Description_                                    | _Remark_ |
| :---------- | :--------: | :----------------------------------------------- | :------- |
| _File path_ |     ○      | _Path of the file to be used for the wallpaper._ |          |

### _Wallpaper - Slide_

_Set the background of images slide._

| _Name_               | _Required_ | _Description_                                                 | _Remark_                                                                        |
| :------------------- | :--------: | :------------------------------------------------------------ | :------------------------------------------------------------------------------ |
| _File paths_         |     ○      | _Path of the files to be used for the images slide._          |                                                                                 |
| _Interval time_      |     ○      | _Image switching time. (Hour, Minute, Second, MilliSecond)_   |                                                                                 |
| _Randome play_       |     -      | _Randomize image switching._                                  | _Default False._                                                                |
| _Effect fade in_     |     -      | _Display Fade in effect when switching image._                | _Default True._                                                                 |
| _Load wait complete_ |     -      | _Wait for the screen to display until all images are loaded._ | _Default False. <br /> Depending on the images file size, startup may be slow._ |

### _Wallpaper - Movie_

_Set the background of movie._

| _Name_          | _Required_ | _Description_          | _Remark_       |
| :-------------- | :--------: | :--------------------- | :------------- |
| _Playback rate_ |     ○      | _Movie playback rate._ | _Default 1.0._ |

\* _Mute is a specification._

### _Favorite_

_Register and recall background settings._

| _Name_     | _Required_ | _Description_                                                               | _Remark_ |
| :--------- | :--------: | :-------------------------------------------------------------------------- | :------- |
| _Start up_ |     -      | _Set a random background from the favorite settings when VSCode starts up._ |          |

#### _Favorite - On demand_

_Switch images without having to install your favorite images each time._

\* _Only favorite image._

### _Watermark_

_Change the image of VSCode's watermark._

\* _Then, after set the watermark setting, run `Set` or `Reset`._

### _WebSocket_

_By preparing a [dedicated server](https://github.com/Angelmaneuver/fortune-slip), wallpaper can be set via WebSocket._

_otherwise, an application that sends image data when a client makes a WebSocket connection can be substituted._

\* _Please use only trusted server as we can't verify delivery data._

#### _Q & A_

_Q. Why WebSocket instead of http ?_

_A. VSCode only allows http**s** and ws in **C**ontent **S**ecurity **P**olicy_

### _Sync_

_Background image can be shared between different machines._

#### _Upload_

_Upload the background image._

#### _Download_

_Download and setup the background image._

#### _Delete_

_Delete uploaded image._

<details><summary><i>Warning</i></summary>

_The Sync feature is achieved by converting image data to strings in Base64 and sharing them via Settings Sync._

_Settings Sync backend is probably provided by Microsoft. And definitely not intended for image data sharing._

_If you try to share an image file over MB (maybe even KB) with Settings Sync, **Microsoft will be offended**. They will reject the this extension and possibly **disable the account of the user using the this extension from Settings Sync**._

_If you use it, please take its dangers into consideration._

##### _About image data to be uploaded_

_The Base64 string uploaded to Settings Sync is encrypted in AES256 CTR mode._

_Therefore, there is no fear of prying eye._

_Unless you use poor values for password and salt, or I have made a mistake in the implementation of the cryptographic call._

</details>

### _Uninstall_

_Erase wallpaper from VSCode, and delete data related to Wallpaper Setting._

### _Environment Variables Support_

_Environment variables can be used in the path that specifies the image file._

| _Notation_                          | _Description_                                                                          | _Remark_                                          |
| :---------------------------------- | :------------------------------------------------------------------------------------- | :------------------------------------------------ |
| _${userHome}_                       | _Returns the string path of the current user's home directory._                        | _Implementation-wise, we use node.js os.homedir._ |
| _${\<Environment Variables Name\>}_ | _If the environment variable specified in $\{~\} exists, it is replaced by its value._ |                                                   |

</details>

<details><summary><i>Required</i></summary>

### _Write permission_

_This extension modifies the following files in the VSCode installation directory, so requires write permission._

1. _/Resources/app/out/vs/code/electron-sandbox/workbench/workbench.js_
1. _/Resources/app/out/vs/code/electron-sandbox/processExplorer/processExplorer.js (Only when setting the background color for Process Explorer)_

_Therefor, this extension cannot be used with VSCode installed from "Snap Store" App Store for Linux (Because write permission cannot be obtained)._

</details>

<details><summary><i>Caution</i></summary>

### _How will this extension affect your environment ?_

_This extension modifies the following files in the VSCode installation directory._

1. _/Resources/app/out/vs/code/electron-sandbox/workbench/workbench.js_
1. _/Resources/app/out/vs/code/electron-sandbox/processExplorer/processExplorer.js (Only when setting the background color for Process Explorer)_

_and following files._

1. _settings.json_
1. _extensions.json (Only when using the Sync feature)_

### _You will be warned that it is not supported_

_Prior to VSCode 1.72, the relevant message was not displayed.
In fact, it is more correct to display._

_[The official explanation of this message is roughly as follows.](https://code.visualstudio.com/docs/supporting/faq#_installation-appears-to-be-corrupt-unsupported)_

> _We are not trying to block VS Code patching, but we want to raise awareness that patching VS Code means you are running an unsupported version._

_Respecting this assertion, this extension makes no attempt to prevent such messages from being displayed._

_Even if we were to prevent it from being displayed, I believe the officials will block it._

</details>

<details><summary><i>Other</i></summary>

### _External libraries used by this extension_

1. _[vscode/l10n](https://github.com/microsoft/vscode-l10n)_
1. _[jsonc-parser](https://github.com/microsoft/node-jsonc-parser)_
1. _[clean-css](https://github.com/clean-css/clean-css)_
1. _[terser](https://github.com/terser/terser)_

</details>

<br />

# 日本語版

<details><summary><i>日本語版を開く</i></summary>

<br />

_コード、画像、UI_

<font size="7"><span style="font-size:3.45rem;"><b><i>はっきり言えます。<br />くっきりクリアです。</i></b></span></font>

![くっきりクリアです。](docs/images/readme01.png)

_**Wallpaper Setting**が提供する背景は、目の覚めるような美しさ。**VSCode の背景だけを透明にする**事ができ、他の背景設定拡張機能と比べ物にならない鮮やかさです。UI と画像は豊かなコントラストで細部までくっきり際立たせ、コードはどこまでもシャープに読みやすく映し出します。_

<font size="7"><span style="font-size:3.45rem;"><b><i>デメリット？<br />メリットしかありません。</i></b></span></font>

<table width="100%">
  <tr>
    <th width="50%"><img src="docs/images/readme02.png" /></th>
    <th width="50%"><img src="docs/images/readme03.png" /></th>
  </tr>
  <tr>
    <td width="50%"><div align="center"><i><font size="3.5"><span style="font-size:1.15rem;">Wallpaper Setting</span></font><br />Opacity 0.4%</i></div></td>
    <td width="50%"><div align="center"><i><font size="3.5"><span style="font-size:1.15rem;">Other Extensions</span></font><br />Opacity 0.4% (0.6%)</i></div></td>
  </tr>
</table>

_**鮮やかなエディター。** Wallpaper Setting は**他の拡張機能では得られない鮮やかさ。** 何も犠牲にする事なく最高の体験が楽しめます。_

<font size="7"><span style="font-size:3.45rem;"><b><i>Wallpaper Setting を使い始めよう。</i></b></span></font>

![Wallpaper Setting を使い始めよう。](docs/images/readme04.ja.gif)

_**Wallpaper Setting で背景を設定するのはお茶のこさいさいです。** `⇧⌘P` でコマンドパレットを表示して `Wallpaper Setting` と入力し、メニューから`最適化`を実行して画像や動画を背景に設定する。それだけ。_

<font size="7"><span style="font-size:3.45rem;"><b><i>お気に召すまま。</i></b></span></font>

![お気に召すまま。](docs/images/readme05.ja.gif)

_Wallpaper Setting では VSCode のパーツ毎に透明度を設定できます。パーツ毎に見やすい透明度を設定して貴方だけの最高のエディターを手に入れましょう!_

<font size="7"><span style="font-size:3.45rem;"><b><i>さぁ Wallpaper Setting をインストールして、最高の VSCode を手に入れよう!</i></b></span></font>

<details><summary><i>詳細仕様</i></summary>

### _Wallpaper - 画像_

_画像を背景に設定する。_

| _名前_      | _必須_ | _概要_                               | _備考_ |
| :---------- | :----: | :----------------------------------- | :----- |
| _File path_ |   ○    | _背景に使用する画像ファイルのパス。_ |        |

### _Wallpaper - スライド_

_画像のスライドを背景に設定する。_

| _名前_               | _必須_ | _概要_                                                               | _備考_                                                                                       |
| :------------------- | :----: | :------------------------------------------------------------------- | :------------------------------------------------------------------------------------------- |
| _File paths_         |   ○    | _画像のスライドに使用する画像ファイルのパス。_                       |                                                                                              |
| _Interval time_      |   ○    | _画像の切り替え時間。 (時、分、秒、ミリ秒)_                          |                                                                                              |
| _Randome play_       |   -    | _画像の切り替えをランダムにする。_                                   | _デフォルト False_                                                                           |
| _Effect fade in_     |   -    | _画像の切り替え時にフェードイン効果を適用する。_                     | _デフォルト True_                                                                            |
| _Load wait complete_ |   -    | _画像のスライドに使用する全ての画像ファイルが読み込まれるまで待つ。_ | _デフォルト False <br /> 画像のファイルサイズによっては、起動に時間が掛かる場合があります。_ |

### _Wallpaper - 動画_

_動画を背景に設定する。_

| _名前_          | _必須_ | _概要_               | _備考_           |
| :-------------- | :----: | :------------------- | :--------------- |
| _Playback rate_ |   ○    | _動画の再生レート。_ | _デフォルト 1.0_ |

\* _ミュートになるのは仕様です。_

### _お気に入り_

_壁紙設定の登録と呼び出す機能です。_

| _Name_     | _Required_ | _Description_                                                 | _Remark_ |
| :--------- | :--------: | :------------------------------------------------------------ | :------- |
| _Start up_ |     -      | _VSCode 起動時の壁紙をお気に入り設定からランダムに設定する。_ |          |

#### _お気に入り - オンデマンド_

_お気に入りで設定した画像をインストールし直すことなく、背景画像を切り替えることができます。_

\* _お気に入りで設定した画像設定のみ。_

### _Watermark_

_VSCode のウォーターマーク画像を変更します。_

\* _ウォーターマークを設定した後で、`セット`か`リセット`を実行してください。_

### _WebSocket_

_[専用サーバー](https://github.com/Angelmaneuver/fortune-slip)を用意することで、 WebSocket 経由で壁紙を設定することができます。_

_又は、クライアントから接続された時に画像ファイルを返すアプリケーションであればこの機能を利用することができます。_

\* _サーバーからのレスポンスデータを検証できないので信頼できるサーバーでのみご利用ください。_

#### _Q & A_

_Q. なぜ http ではなく WebSocket なのか?_

_A. VSCode は **C**ontent **S**ecurity **P**olicy (コンテンツセキュリティポリシー) で http**s** と **ws** しか許可していません。_

### _同期_

_異なるマシン間で背景を共有する機能です。_

#### _アップロード_

_背景画像をアップロードします。_

#### _ダウンロード_

_画像をダウンロードし、背景に設定します。_

#### _デリート_

_アップロードした画像を削除します。_

<details><summary><i>注意事項</i></summary>

_同期機能は画像ファイルのデータを Base64 (文字列データ) に変換し、Settings Sync で共有することで実現しています。_

_Settings Sync のバックエンドは、おそらく Microsoft が提供しています。そして間違いなくこの用途 (画像データの共有) を目的としていません。_

_もし MB (KB もあるかもしれない) 以上の画像ファイルを Settings Sync で共有しようとすると **Microsoft は怒る**かもしれない。そして Microsoft はこの拡張機能を無効化し、場合によってはこの**拡張機能を使用しているユーザーアカウントが Settings Sync を使用できないようにする**かもしれません。_

_同期機能を使用する場合は、上記注意事項を理解した上でご利用ください。_

##### _アップロードする画像データについて_

_Settings Sync にアップロードされる Base64 データは、AES256 CTR モードで暗号化します。_

_従って元の画像の眼が第三者の目に触れることはありません。_

_貴方がパスワードとソルトに不適切な値を用いるか、暗号モジュール呼び出しの実装で、この拡張機能の開発者がミスをしない限りは。_

</details>

### _アンインストール_

_VSCode から背景を消去し、この拡張機能に関するデータを削除します。_

### _環境変数のサポート_

_画像ファイルを指定するパスに環境変数を使用することができます。_

| _記法_              | _概要_                                                                            | _備考_                                              |
| :------------------ | :-------------------------------------------------------------------------------- | :-------------------------------------------------- |
| _${userHome}_       | _ログインユーザーのホームディレクトリの文字列パスを返します。_                    | _実装的には node.js の os.homedir を使用している。_ |
| _${\<環境変数名\>}_ | _$\{~\} で指定された環境変数が存在する場合、その環境変数の値で置き換えられます。_ |                                                     |

</details>

<details><summary><i>必要要件</i></summary>

### _書き込み権限_

_この拡張機能は VSCode インストールディレクトリ配下にある以下のファイルを変更します。そのため、それらのファイルへの書き込み権限が必要です。_

1. _/Resources/app/out/vs/code/electron-sandbox/workbench/workbench.js_
1. _/Resources/app/out/vs/code/electron-sandbox/processExplorer/processExplorer.js (プロセスエクスプローラーへ背景色を設定する時のみ)_

_そのため Linux 向けの App Store 『Snap Store』からインストールした VSCode では、この拡張機能を使用できません (書き込み権限が取得できないため)。_

</details>

<details><summary><i>注意事項</i></summary>

### _この拡張機能は貴方の環境にどのような影響を与えますか?_

_この拡張機能は VSCode インストールディレクトリ配下の以下のファイルを変更します。_

1. _/Resources/app/out/vs/code/electron-sandbox/workbench/workbench.js_
1. _/Resources/app/out/vs/code/electron-sandbox/processExplorer/processExplorer.js (プロセスエクスプローラーへ背景色を設定する時のみ)_

_及び以下のファイルに変更を加えます。_

1. _settings.json_
1. _extensions.json (同期機能を使用する時のみ)_

### _サポートされていないと警告が表示される_

_VSCode 1.72 以前では当該メッセージは表示されませんでした。実際は表示されるのが正しいです。_

_[この警告メッセージに関して公式は、以下のように述べています。](https://code.visualstudio.com/docs/supporting/faq#_installation-appears-to-be-corrupt-unsupported)_

> _私たちは VSCode のパッチ適用をブロックしようとしているわけではありませんが、VSCode にパッチを適用するということはサポートされていない VSCode を使用しているという認識を高めたいと考えています。_

_この主張を尊重し、この拡張機能では当該メッセージが表示されないようにするような対応はしません。_

_仮に表示されないようにしたとしても公式はさらにそれを防ごうとして、いたちごっこになると考えています。_

</details>

<details><summary><i>その他</i></summary>

### _この拡張機能で使用している外部ライブラリ_

1. _[vscode/l10n](https://github.com/microsoft/vscode-l10n)_
1. _[jsonc-parser](https://github.com/microsoft/node-jsonc-parser)_
1. _[clean-css](https://github.com/clean-css/clean-css)_
1. _[terser](https://github.com/terser/terser)_

</details>

</details>
