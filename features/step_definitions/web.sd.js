// noinspection NpmUsedModulesInstalled
const { When, Then, Given } = require('@cucumber/cucumber');
const YAML = require('yaml');

When(/^I go to "([^"]*)"$/, async function (url) {
    await browser.url(url);
});

When(/^I check the texts of the elements:$/, async function (table) {
    const rows = table.hashes()
    for (const row of rows) {
        expect(await $(row.selector).getText())
            .toEqual(row.text)
    }
});

When(/^I expect element: "([^"]*)" (text|value): "([^"]*)"$/, async function (selector, type, text) {
    const methods = {
        text: 'getText',
        value: 'getValue'
    }
    expect(await $(selector)[methods[type]]())
        .toEqual(text)
});

When('I go to {string} menu item', function (item) {
    // add implementation here
});

When(/^I fill form:$/, function (formYaml) {
    const formData = YAML.parse(formYaml);
    console.log({ formData });
    // add implementation here
});

When('I login as: {string}, {string}', function (login, password) {
    // add implementation here
});
