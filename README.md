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
    <td width="50%"><div align="center"><i><font size="3.5">Wallpaper Setting</font><br />Opacity 0.4%</i></div></td>
    <td width="50%"><div align="center"><i><font size="3.5">Other Extensions</font><br />Opacity 0.4% (0.6%)</i></div></td>
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

## _External libraries used by this extension_

1. _[vscode/l10n](https://github.com/microsoft/vscode-l10n)_
1. _[jsonc-parser](https://github.com/microsoft/node-jsonc-parser)_
1. _[clean-css](https://github.com/clean-css/clean-css)_
1. _[terser](https://github.com/terser/terser)_

</summary>
