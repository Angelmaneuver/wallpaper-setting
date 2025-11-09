# Change Log

## 2.0.1

- Fixed bug where abnormal behavior occurs only after webpack bundling
- Fixed bug with import from favorites
- Fixed bug when combining slide fade-in with filter brightness

## 2.0.0

- Major Update
- Support for the feature to set background for individual layouts

## 1.5.2

- Support for version 1.102.0

## 1.5.1

- Fixed the editor area displaying differently from full screen when wallpaper is set for individual layouts

## 1.5.0

- Discontinued the feature to add background color to the Process Explorer
- Fixed batch optimization to include terminals (Cancel v1.4.8)
- Added feature to set wallpaper for individual layouts

## 1.4.9

- Temporary response to malfunction due to specification change in Process Explorer

## 1.4.8

- Exclude terminals from batch optimized

## 1.4.7

- Added filter feature to apply graphic effects

## 1.4.6

- Changed the status bar display to an icon when no images is unselected in the on-demand feature

## 1.4.5

- Fixed so that slide file paths can also be managed by directory (to data slimming in settings.json)

## 1.4.4

- The opacity setting applied in the menu for batch optimization has been changed from basic area to selected area

## 1.4.3

- Fixed Readme

## 1.4.2

- Japanese language support to readme

## 1.4.1

- Fixed Readme

## 1.4.0

- Fixed the ability to the all background parts that can be optimize individually
- Fixed to that optimze can be performed even for parts where color information does not exist in the color theme
- Review batch optimize targets
- Fixed to display the menu without exiting the extension after each optimize command is execute

## 1.3.5

- Added the ability to remove optimized color theme information

## 1.3.4

- The following items added to the parts that can be optimize individually

  1. Side Bar
  1. Mini Map
  1. Terminal

- Fixed a problem with the on-demand change function appearing in the status bar when not installed

- Discontinue the parameters prior to version 1.0.0

- Preparation for discontinuation of the profile feature

## 1.3.3

- Color theme optimize of some parts can now be set individually

  1. Activity Bar
  1. Status Bar

## 1.3.2

- Movie ability changed from option to standard
- Changed to be able to manage movie favorites
- Fixed to allow setting of movie playback rate

## 1.3.1

- Fixed a bug that caused incorrect menu display for the favorite feature
- Fixed video placement to be the same as for images
- Management of favorite images selected in the on demand feature has been changed to a per resource basis

## 1.3.0

- Added the ability to on demand change image for wallpaper

## 1.2.2

- Fixed a bug that prevented registering favorites from the initial state with no data

## 1.2.1

- Fixed a bug that caused images to be loaded in batches regardless of the Load wait complete option

## 1.2.0

- Added the ability to set movie file for wallpaper

## 1.1.1

- Added the following to ColorCustomizations

  1. added 'editorGroup.emptyBackground' to area of overlap
  1. added 'minimap.background' to area of overlap

## 1.1.0

- Added the ability to set watermark
- improved optimize ability (Fixed to be able to get color theme's json file from pc)
- Fixed bugs

## 1.0.1

- Added the ability to set wallpaper from server via WebSocket

## 1.0.0

- Disruptive Updates
- Normal mode eliminated (Due to complicated maintenance)
- Eliminate parameter to enable advanced mode (always advanced mode from now on)
- Eliminate parameter to enable synchronization ability (always displayed synchronization ability from now)
- Added the ability to set wallpaper in profile

## 0.11.0

- Change image file handling from base64 to file links
- Added Japanese as supported language
- Added the ability to use environment variables to specify file paths

## 0.10.3

- Fixed a bug sync upload size was not checked
- Fixed color theme loading correctly for Optimize (Fix to use [jsonc-parser](https://github.com/microsoft/node-jsonc-parser))
- Fixed a bug that caused incorrect values when 0 was given for Optimize

## 0.10.2

- Fixed a bug that the wallpaper is not displayed when reloading

## 0.10.1

- Run in VSCode's local extension host (Pull request [#6](https://github.com/Angelmaneuver/wallpaper-setting/pull/6))

## 0.10.0

- Settings are now managed by default profile

## 0.9.1

- Added the function to set background color in Process Explorer (issue [#5](https://github.com/Angelmaneuver/wallpaper-setting/issues/5) have been supported)

## 0.9.0

- Response to VSCode 1.72 (No additional functions or fixes)

## 0.8.2

- Deprecated announce

## 0.8.1

- Opacity is no longer displayed as a setting item in Advanced mode
- Revised the UI of the favorites function and added the function to open a new window with favorite wallpaper settings

## 0.8.0

- Added the Advanced Mode function

## 0.7.2

- Fixed a bug that prevented the function to set at random from favorites at start up working

## 0.7.1

- Fixed a bug that caused an anomaly in downloading when uploading with a blank input for opacity used for sync

## 0.7.0

- Added the Sync function to share wallpaper settings between multiple machines

## 0.6.0

- Lightweight by bundle modules with webpack (No additional functions or fixes)

## 0.5.9

- Fixed a bug in version 1.66 where the background change no longer works on reload

## 0.5.8

- Up-to-date the libraries used in development of this extension and fixed the source (No additional functions or fixes)

## 0.5.7

- Added a pre check to see if the extension meets the prerequisites to work, and if not, it so that people like Christian Rhodes can find out why

## 0.5.6

- Added the function to specify only images or slides to the feature that sets the wallpaper random from favorite at start up

## 0.5.5

- Fixed to display a confirm dialog before uninstall

## 0.5.4

- In the dialog for selecting slide target files, it is now possible to select multiple files
- Fixed to not set wallpaler in Process Explorer (from issue [#2](https://github.com/Angelmaneuver/wallpaper-setting/issues/2))

## 0.5.3

- Rewrite the Readme (Reflects findings from issue [#1](https://github.com/Angelmaneuver/wallpaper-setting/issues/1))

## 0.5.2

- Added WebP as a configurable image format

## 0.5.1

- Rewrite the Readme
- Code review
- Fixed image alignment to be centered

## 0.5.0

- Added the function to set a random wallpaper from favorite settings at start up

## 0.4.0

- Added the function to unregister from favorite wallpaper settings
- Added the function to random playback of slide
- Added fade in effect to slide

## 0.3.0

- Code review
- Added the function to manage favorite wallpaper settings

## 0.2.1

- Fixed a bug that caused unintended transitions when the opacity setting was changed after the slide setting was changed in the individual settings

## 0.2.0

- Fixed a bug that allowed invalid values to be entered for the scan interval
- Fixed a bug that prevented parameters from being set correctly
- Added the function to change indivisual setting values

## 0.1.0

- Change icon
- Changed from command driven to menu invoked by command
- Added slide function

## 0.0.1

- Initial release
