Feature: User Creation

  Background:
    When I go to "https://viktor-silakov.github.io/course-sut/index.html?quick"
    When I login as: "walker@jw.com", "password"

  Scenario: Create user
    When I go to "Create User" menu item
    When I fill form and create new User:
      """
      email: 'test@test.com'
      password: 'U&cmpYsxK9'
      address1: 'Rustaveli 20-21'
      address2: 'flor 4'
      city: 'Tbilisi'
      zip: 222567
      description: 'test user'
      """
    When I go to "List of users" menu item
    Then I check the newly created user "test@test.com"