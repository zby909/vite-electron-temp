/*
 * @Description:
 * @Author: zby
 * @Date: 2023-11-22 16:08:49
 * @LastEditors: zby
 * @Reference:
 */

export default [
  {
    beforeActions: [],
    visit: 'D-1',
    form: 'Inclusion/Exclusion',
    unitTests: [
      {
        id: '129',
        lineNum: '3',
        cases: [
          {
            id: '',
            field: 'Criterion Type',
            fieldType: 'RadioButton (Vertical)',
            relateFields: [
              {
                name: 'Does the subject meet all inclusion and exclusion criteria?',
                value: 'No',
              },
            ],
            testValue: 'Empty',
            testValueIsBlank: true,
            expectedResult: 'Query Opened',
            queryMessage: '"Does the subject meet all inclusion and exclusion criteria?" is "No", "Criterion Type" is required. Please provide.',
          },
        ],
      },
      {
        id: '130',
        lineNum: '4',
        cases: [
          {
            id: '',
            field: 'Criterion Type',
            fieldType: 'RadioButton (Vertical)',
            relateFields: [
              {
                name: 'Does the subject meet all inclusion and exclusion criteria?',
                value: 'Yes',
              },
            ],
            testValue: 'Inclusion',
            testValueIsBlank: false,
            expectedResult: 'Query Opened',
            queryMessage:
              '"Does the subject meet all inclusion and exclusion criteria?" is "Yes"; however, "Criterion Type" is not blank. Please confirm or update as appropriate.',
          },
        ],
      },
      {
        id: '131',
        lineNum: '5',
        cases: [
          {
            id: '',
            field: 'Criterion Not Met',
            fieldType: 'Dynamic SearchList',
            relateFields: [
              {
                name: 'Does the subject meet all inclusion and exclusion criteria?',
                value: 'No',
              },
            ],
            testValue: 'Empty',
            testValueIsBlank: true,
            expectedResult: 'Query Opened',
            queryMessage: '"Does the subject meet all inclusion and exclusion criteria?" is "No", "Criterion Not Met" is required. Please provide.',
          },
        ],
      },
      {
        id: '132',
        lineNum: '6',
        cases: [
          {
            id: '',
            field: 'Criterion Not Met',
            fieldType: 'Dynamic SearchList',
            relateFields: [
              {
                name: 'Does the subject meet all inclusion and exclusion criteria?',
                value: 'Yes',
              },
            ],
            testValue: 'Inclusion 4',
            testValueIsBlank: false,
            expectedResult: 'Query Opened',
            queryMessage:
              '"Does the subject meet all inclusion and exclusion criteria?" is "Yes"; however, "Criterion Not Met" is not blank. Please confirm or update as appropriate.',
          },
        ],
      },
    ],
  },
];
