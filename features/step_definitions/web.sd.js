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

Then('I check the newly created user {string}', async function (newUserEmail) {
    const userData = {};
    userData.email = newUserEmail;
    userData.password = this.state.formData.password
    const userRow = await $(`//*[text()="${newUserEmail}"]/..`);
    userData.address1 = await userRow.$('.//*[@tabulator-field="address1"]').getText()
    userData.address2 = await userRow.$('.//*[@tabulator-field="address2"]').getText()
    userData.city = await userRow.$('.//*[@tabulator-field="city"]').getText()
    userData.zip = parseInt(await userRow.$('.//*[@tabulator-field="zip"]').getText(), 10)
    userData.description = await userRow.$('.//*[@tabulator-field="description"]').getText()
    await expect(this.state.formData).toEqual(userData)
});

When(/^I expect element: "([^"]*)" (text|value): "([^"]*)"$/, async function (selector, type, text) {
    const methods = {
        text: 'getText',
        value: 'getValue'
    }
    expect(await $(selector)[methods[type]]())
        .toEqual(text)
});

When('I go to {string} menu item', async function (item) {
    await $(`*=${item}`).click()
});

When(/^I fill form and create new User:$/, async function (formYaml) {
    const formData = YAML.parse(formYaml);
    this.state.formData = formData;
    for (const field in formData) {;
        await $(`//*[@id="${field}"]`).setValue(formData[field])    
    }
    await $('//button[contains(text(), "Create")]').click();
});

When('I login as: {string}, {string}', async function (login, password) {
    await $('#login').setValue(login)
    await $('#password').setValue(password)
    await $('button').click()
    await $('#spinner').waitForDisplayed({ reverse: true, timeout: 15000 })
});

Then(/^I check the wrong user credentials:$/, async function(table){
    const rows = table.hashes()
    for (const row of rows) {
        await $('#login').setValue(row.login)
        await $('#password').setValue(row.password)
        await $('//button[normalize-space(text())="Login"]').click()
        expect(await $('#error').getText()).toEqual(row.message)
    }
})

Then ('I play game till {int} score', async function(targetScore){
    let currentScore = 0
    let currentBallPos = 0
    let currentPadPos = 0
    await $('//button[text()="PLAY"]').click()
    await browser.waitUntil(async () => {
        currentBallPos = (await $('#ball').getLocation()).x
        currentPadPos = (await $('#pad').getLocation()).x + 75
        if (currentBallPos > currentPadPos){
            await browser.keys(['d', 'd'])
        } else {
            await browser.keys(['a', 'a'])
        }
        currentScore = parseInt( await $('#points').getText(), 10 )
        if (currentScore < targetScore) {
            return false
        } else {
            return true
        }
    },
    {   timeout: 60000,
        interval: 50,
        timeoutMsg: `GAME OVER!`
    })
})