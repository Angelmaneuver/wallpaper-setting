<div style="text-align:center;">
	<h1>Wallpaper Setting</h1>
	Set an image as the VSCode background.
	<div style="margin-top:1em;">
		<img alt="Version" src="https://img.shields.io/github/package-json/version/angelmaneuver/wallpaper-setting?color=blue" />
		<img alt="Installs" src="https://img.shields.io/visual-studio-marketplace/i/Angelmaneuver.wallpaper-setting" />
		<a href="https://codeclimate.com/github/Angelmaneuver/wallpaper-setting/maintainability"><img src="https://api.codeclimate.com/v1/badges/2627a4a3b1ad7bc2e683/maintainability" /></a>
		<a href="https://codeclimate.com/github/Angelmaneuver/wallpaper-setting/test_coverage"><img src="https://api.codeclimate.com/v1/badges/2627a4a3b1ad7bc2e683/test_coverage" /></a>
		<a href="https://github.com/Angelmaneuver/wallpaper-setting/issues">
			<img alt="Issues" src="https://img.shields.io/github/issues/Angelmaneuver/wallpaper-setting?color=#86D492" />
		</a>
	</div>
</div>

--- 

## Warning
Since version 0.10.0, the management of settings has changed from profile to user settings.

If necessary, manually move the setting values starting with `"wallpaper-setting."` from the profile's `setting.json` to user's `settings.json`.

---

## Usage
### Step1.
Press `⇧⌘P` to bring up the command pallete and enter '`Wallpaper Setting`'.

![Usage Step1. image](resource/readme/usage1.png)

### Step2.
Select the desired setting from the menu.

![Usage Step2. image](resource/readme/usage2.png)

## Feature
### Easy Setup
Just follow the guide to easily set the wallpaper.

![Easy Setup image](resource/readme/demo1.gif)

### Wallpaper - Image
You can set an image as the VSCode background.

![Wallpaper - Image image](resource/readme/demo2.png)

#### Setting items
| Name | Required | Description | Remark |
| :--- | :------: | :---------- | :----- |
| Opacity | △ | Transparency, Can be set to a value between 0.5 and 1. | In Normal mode, transparency is set all elements, including text and images, as well as the background.

### Wallpaper - Slide
You can set a slide image as the VSCode background.

![Wallpaper - Slide image](resource/readme/demo3.gif)

#### Setting items
| Name | Required | Description | Remark |
| :--- | :------: | :---------- | :----- |
| Opacity | *1 | *1 | *1 |
| Slide Interval Time | ○ | Image switching time. (Hour, Minute, Second, MilliSecond) | |
| Randome Play | - | Randomize image switching. | Default False. |
| Effect Fade in | - | Display Fade in effect when switching images. | Default True. |

*1 Same as the Wallpaper - Image.

### Favorite
Do you have many favorite images or slides?

You can easily switch between them using the Favorite Setting.

***Don't repeat yourself!*** with this features.

![Favorite image](resource/readme/demo4.gif)

#### Setting items
| Name | Required | Description | Remark |
| :--- | :------: | :---------- | :----- |
| Start Up | - | Set a random background from the favorite settings when VSCode starts up. | |

### Sync
Are you developing on multiple machines?

***You no longer need to hand out image!*** with this features.

#### Upload
First, upload the wallpaper settings you wish to Sync.

![Sync upload image](resource/readme/demo6.gif)

#### Download
Next, download and setup the wallpaper settings on another machines.

![Sync download image](resource/readme/demo7.gif)

#### Delete
Want to delete your uploaded wallpaper settings?

Of course you can turn it delete. Just go to the menu and click on `Delete` or `Uninstall` and your uploaded wallpaper settings will be gone!

![Sync delete image](resource/readme/demo8.gif)

#### Warning
***Please check the details in the Cautions section.***

\* This feature is disabled by default

\* Only Wallpaper - Image setting can be Sync

\* Image file size is less than 500KB, it can be used for Sync

\* VSCode standard feature `Settings Sync` must be enable

### Uninstall
Didn't like this extension?

Sorry for not being able to help you.

Let's uninstall it and erase all settings related to this extension.

It won't pollute your environment.

![Uninstall image](resource/readme/demo5.gif)

## Advanced Mode
You want to set only the background, but you are not happy that even the text is transparent?

I understand! Let's resolve your complaint.

However, it will take some labor to resolve your complaint.

Also maybe it will not work.

Only those who understand this should use this feature.

![Usage Advanced mode image1](resource/readme/advanced1.png)

## Step1.
Advanced Mode requires the json file of the color theme you are using.

If it is a color theme installed from extension, it is quicker to change the file extension of the vsix file download from marketplace to zip, unzip it, and get it from the theme folder.

We are not sure about the default theme is, so please investigate on your own.

## Step2.
From the VSCode settings screen, check the `Advanced Mode` checkbox in the Wallpaper Setting to enable the feature.

![Usage Advanced mode image2](resource/readme/advanced2.png)

## Step3.
### Calling Wallpaper Setting and select `Optimize`
Invoke Wallpaper Setting from the command palette and select the `Optimize`.

![Usage Advanced mode image3](resource/readme/advanced3.png)

### Enter the Color Theme name
First, the name of color theme you are using will be displayed, so please make sure it is the same. If it is different, please enter the corrent name.

![Usage Advanced mode image4](resource/readme/advanced4.png)

### Enter the transparency
Next, enter the three types of transparency.

![Usage Advanced mode image5](resource/readme/advanced5.png)

| Name      | Description                                               | Remark |
| :-------- | :-------------------------------------------------------  | :----- |
| Base      | Transparency used in basic areas.                         |        |
| Overlap   | Transparency used in overlapping areas.                   |        |
| Selection | Transparency used in areas that shoud not be transparent. |        |

### Enter the Color Theme json file path
Finally, enter the json file path of the Color Theme you prepared.

![Usage Advanced mode image6](resource/readme/advanced6.png)

#### About Optimize
 - This process is required once per Profile
 - Optimized Color Theme information will be added to profile's `settings.json`

## Step4.
After that, please proceed as usual setting from the menu.

In Advanced Mode, transparency settings can only be set when `Optimize`.

## Cautions
### `Installation appears to be corrupt [Unsupported]` message appears.
Prior to VSCode 1.72, the relevant message was not displayed.
In fact, it is more correct to display.

[The official explanation of this message is roughly as follows.](https://code.visualstudio.com/docs/supporting/faq#_installation-appears-to-be-corrupt-unsupported)

 > We are not trying to block VS Code patching, but we want to raise awareness that patching VS Code means you are running an unsupported version.

Respecting this assertion, this extension makes no attempt to prevent such messages from being displayed.

Even if we were to prevent it from being displayed, I believe the officials will block it.

### How will this extension affect your environment?
This extension will make changes to the following three files.

1. "VSCode installation directory" /Resources/app/out/vs/workbench/workbench.desktop.main.js
1. "VSCode installation directory" /Resources/app/out/vs/code/electron-sandbox/processExplorer/processExplorer.js (Only when setting the background color for Process Explorer)
1. settings.json
1. extensions.json (Only when using the Sync feature)

"workbench.desktop.main.js" requires write permission.
Therefor, this extension cannot be used with VSCode installed from "Snap Store" App Store for Linux (Because write permission cannot be obtained).

### About Sync Feature
You probably have the following questions about Sync feature.
 - Why is it disabled by default?
 - Why can't Sync Wallpaper - Slide settings?
 - Why is there a limit of 500KB file size or less?
 - Will the upload images seen by the Setting Sync Administrator?

To answer thees questions, we must first briefly describe the Sync feature.

The Sync feature is achieved by converting image data to strings in Base64 and sharing them via Settings Sync.

Settings Sync backend is probably provided by Microsoft. And definitely not intended for image data sharing.

If you try to share an image file over MB (maybe even KB) with Settings Sync, ***Microsoft will be offended***. They will reject the this extension and possibly ***disable the account of the user using the this extension from Settings Sync***.

this is the reason why it is disabled by default and why limit is set.

### About image data to be uploaded
The Base64 string uploaded to Settings Sync is encrypted in AES256 CTR mode.

Therefore, there is no fear of prying eye.

Unless you use poor values for password and salt, or I have made a mistake in the implementation of the cryptographic call.

### If use the Sync feature with an understanding of the risks
![Usage Sync enable image](resource/readme/usage3.png)

From the VSCode settings screen, check the "Enable Sync" checkbox in the Wallpaper Setting to enable the feature.
