Feature: ATM withdraw

  Scenario Outline: should returns "<message>" as operation result 
    Given my account balance is "<balance>"
    And the ATM contains "<contains>"
    When I withdraw "<withdraw>"
    Then I get "<message>" message
    Examples:
      | balance | contains | withdraw | message                               |
      | 500     | 600      | 50       | Take your money!                      |
      | 500     | 600      | 550      | You don't have enough money!          |
      | 500     | 150      | 300      | The machine is not have enough money! |