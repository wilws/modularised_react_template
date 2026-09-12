/* eslint-disable react-refresh/only-export-components --
 * This barrel deliberately re-exports a whole UI library. Fast refresh cannot
 * verify a wildcard export, and this file holds no component logic of its own,
 * so the rule does not apply here.
 */
export * from "@mantine/core";

/**
 * The single source of every UI primitive in this app.
 *
 * No file outside this folder imports a UI library directly, and no file
 * outside this folder writes a raw <button>, <h1> or <p>. Everything comes
 * from here, so the underlying library can be swapped, themed or patched in
 * one place.
 *
 * To override a primitive:
 * 1. Create a custom `Button.tsx` in `src/app/components/Basic`.
 * 2. Re-export it below, after the wildcard so it wins:
 *
 *    export * from "@mantine/core";            // export all components
 *    export { MyButton as Button } from "./Button"; // override the default Button
 */

/*
Mantine components (@mantine/core v9):

--- Layout ---
AppShell
AspectRatio
Center
Container
Flex
Grid
Group
SimpleGrid
Space
Stack

--- Typography ---
Blockquote
Code
Highlight
List
Mark
Table
Text
Title
TypographyStylesProvider

--- Buttons ---
ActionIcon
Button
CloseButton
CopyButton
FileButton
UnstyledButton

--- Inputs ---
Checkbox
Chip
ColorInput
ColorPicker
Fieldset
FileInput
Input
JsonInput
NativeSelect
NumberInput
PasswordInput
PinInput
Radio
Rating
SegmentedControl
Select
Slider
Switch
Textarea
TextInput
MultiSelect
Autocomplete
TagsInput
Combobox

--- Navigation ---
Anchor
Breadcrumbs
Burger
NavLink
Pagination
Stepper
Tabs
Tree

--- Feedback ---
Alert
Loader
Notification
Progress
RingProgress
SemiCircleProgress
Skeleton

--- Overlays ---
Affix
Dialog
Drawer
FloatingIndicator
HoverCard
LoadingOverlay
Menu
Modal
Overlay
Popover
Tooltip

--- Data display ---
Accordion
Avatar
BackgroundImage
Badge
Card
ColorSwatch
Image
Indicator
Kbd
NumberFormatter
Spoiler
ThemeIcon
Timeline

--- Miscellaneous ---
Box
Collapse
Divider
FocusTrap
Paper
Portal
ScrollArea
Transition
VisuallyHidden

Notes:
- `Title` replaces raw h1-h6 (use the `order` prop: <Title order={2} />).
- `Text` replaces raw <p> and <span>.
- `Anchor` replaces raw <a>; for routing use `component={Link}`.
- Mantine needs <MantineProvider> at the app root - see src/app/App.tsx.
*/
