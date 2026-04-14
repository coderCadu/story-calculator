## 1. Update Checkbox Styling

- [x] 1.1 Add `.checkbox-label` styles to `styles.css` with Material Design dark theme
- [x] 1.2 Style `input[type="checkbox"]` with rounded borders matching form aesthetics
- [x] 1.3 Add hover state styles with subtle border color change
- [x] 1.4 Add focus state styles with visible focus indicator (outline/glow)
- [x] 1.5 Add smooth CSS transitions for state changes (checked/unchecked, hover, focus)
- [x] 1.6 Ensure checkbox and label are properly associated and styled as grouped element
- [x] 1.7 Test checkbox styling in different states (unchecked, checked, hover, focus)

## 2. Verify Output Contract Includes baseStoryEffort

- [x] 2.1 Check if `baseStoryEffort` is already exposed in `src/application/contracts/sprintCalculationContracts.js`
- [x] 2.2 If not exposed, add `baseStoryEffort` field to output contract with label "Esforço base da história" and formula
- [x] 2.3 Ensure `baseStoryEffort` value comes from domain calculator result

## 3. Update UI to Display baseStoryEffort

- [x] 3.1 Verify `baseStoryEffort` appears in `resultMetrics` computed property in `app.js`
- [x] 3.2 Ensure `baseStoryEffort` is categorized as 'story' metric in categorization logic
- [x] 3.3 Verify metric displays correctly in Story Analysis section of results dashboard
- [x] 3.4 Manually test that baseStoryEffort shows correct value (storyPoints × pointValue)

## 4. Update UI Tests

- [x] 4.1 Add test in `test/ui/page.test.js` to verify checkbox has Material Design styling
- [x] 4.2 Add test to verify checkbox label is properly associated
- [x] 4.3 Update or add test to verify `baseStoryEffort` appears in output
- [x] 4.4 Verify all UI tests pass with new changes

## 5. Update Application Tests

- [x] 5.1 Verify `test/application/calculateSprintValue.acceptance.test.js` includes `baseStoryEffort` in output assertions
- [x] 5.2 If needed, add assertion to verify `baseStoryEffort` equals storyPoints × pointValue
- [x] 5.3 Run all application tests to ensure contract changes don't break existing tests

## 6. Verification

- [x] 6.1 Run complete test suite: `npm test`
- [x] 6.2 Verify all tests pass
- [x] 6.3 Start dev server and manually test checkbox styling in browser
- [x] 6.4 Verify checkbox matches Material Design dark theme aesthetic
- [x] 6.5 Verify `baseStoryEffort` displays in Story Analysis section
- [x] 6.6 Test with different input values to confirm `baseStoryEffort` calculation is correct
