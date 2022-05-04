# Wallpaper Setting

![GitHub package.json dynamic](https://img.shields.io/github/package-json/categories/angelmaneuver/wallpaper-setting?color=green) ![Visual Studio Marketplace Last Updated](https://img.shields.io/visual-studio-marketplace/last-updated/angelmaneuver.wallpaper-setting) ![Visual Studio Marketplace Installs](https://img.shields.io/visual-studio-marketplace/i/Angelmaneuver.wallpaper-setting) ![GitHub Workflow Status](https://img.shields.io/github/workflow/status/angelmaneuver/wallpaper-setting/Wallpaper%20Setting%20CI) [![Maintainability](https://api.codeclimate.com/v1/badges/2627a4a3b1ad7bc2e683/maintainability)](https://codeclimate.com/github/Angelmaneuver/wallpaper-setting/maintainability) [![Test Coverage](https://api.codeclimate.com/v1/badges/2627a4a3b1ad7bc2e683/test_coverage)](https://codeclimate.com/github/Angelmaneuver/wallpaper-setting/test_coverage) [![License](https://img.shields.io/github/license/Angelmaneuver/wallpaper-setting)](LICENSE)

Set an image as the VSCode background.

## Usage
### Step1.
Press '`⇧⌘P`' to bring up the command pallete and enter '`Wallpaper Setting`'.

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

Setting items
 - Opacity

### Wallpaper - Slide
You can set a slide image as the VSCode background.

![Wallpaper - Slide image](resource/readme/demo3.gif)

Setting items
 - Opacity
 - Slide Interval Time (Hour, Minute, Second, MilliSecond)
 - Random Play
 - Fade-in Effect

### Favorite
Do you have many favorite images or slides?

You can easily switch between them using the Favorite Setting.

***Don't repeat yourself!*** with this features.

![Favorite image](resource/readme/demo4.gif)

Setting items
 - Set wallpaper from favorite settings randomly when starting VSCode

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

Of course you can turn it delete. Just go to the menu and click on "Delete" or "Uninstall" and your uploaded wallpaper settings will be gone!

![Sync delete image](resource/readme/demo8.gif)

#### Warning
***Please check the details in the Cautions section.***

\* This feature is disabled by default

\* Only Wallpaper - Image setting can be Sync

\* Image file size is less than 500KB, it can be used for Sync

\* VSCode standard feature "Settings Sync" must be enable

### Uninstall
Didn't like this extension?

Sorry for not being able to help you.

Let's uninstall it and erase all settings related to this extension.

It won't pollute your environment.

![Uninstall image](resource/readme/demo5.gif)

## Cautions
### How will this extension affect your environment?
This extension will make changes to the following three files.

1. "VSCode installation directory" /resources/app/out/bootstrap-window.js
1. settings.json
1. extensions.json (Only when using the Sync feature)

"bootstrap-window.js" requires write permission.
Therefor, this extension cannot be used with VSCode installed from "Snap Store" App Store for Linux (Because write permission cannot be granted).

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

The Base64 string uploaded to Settings Sync is encrypted in AES256 CTR mode.

Therefore, there is no fear of prying eye.

Unless you use poor values for password and salt, or I have made a mistake in the implementation of the cryptographic call.

### If use the Sync feature with an understanding of the risks

![Usage Sync enable image](resource/readme/usage3.png)

From the VSCode settings screen, check the "Enable Sync" checkbox in the Wallpaper Setting to enable the feature.
