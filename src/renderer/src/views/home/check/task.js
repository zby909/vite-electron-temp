/*
 * @Description:
 * @Author: zby
 * @Date: 2023-11-22 16:08:49
 * @LastEditors: zby
 * @Reference:
 */

export const tasks = [
  {
    beforeActions: [],
    visit: 'D-1',
    form: 'Eligibility',
    unitTests: [
      {
        id: '135',
        lineNum: '3',
        cases: [
          {
            id: '',
            field: 'Was the subject ENROLLED?',
            fieldType: 'RadioButton (Vertical)',
            relateFields: [
              {
                name: 'Does the subject meet all inclusion and exclusion criteria?',
                value: 'No',
              },
            ],
            testValue: 'Yes',
            testValueIsBlank: true,
            expectedResult: 'open',
            queryMessage:
              'The subject does not meet all inclusion/exclusion criteria; however, "Was the subject ENROLLED?" is "Yes". Please confirm or update as appropriate.',
          },
        ],
      },
      {
        id: '136',
        lineNum: '4',
        cases: [
          {
            id: '',
            field: 'Please specify the reason for screen failure',
            fieldType: 'RadioButton (Vertical)',
            relateFields: [
              {
                name: 'Does the subject meet all inclusion and exclusion criteria?',
                value: 'Yes',
              },
            ],
            testValue: 'Did not meet eligibility criteria',
            testValueIsBlank: true,
            expectedResult: 'open',
            queryMessage:
              'The subject meets all inclusion/exclusion criteria; however, the screen failure reason is "Did not meet eligibility criteria". Please confirm or update as appropriate.',
          },
        ],
      },
      {
        id: '137',
        lineNum: '5',
        cases: [
          {
            id: '',
            field: 'Please specify the reason for screen failure',
            fieldType: 'RadioButton (Vertical)',
            relateFields: [
              {
                name: 'Does the subject meet all inclusion and exclusion criteria?',
                value: 'No',
              },
            ],
            testValue: 'Did not meet eligibility criteria',
            testValueIsBlank: true,
            expectedResult: 'open',
            queryMessage:
              'The subject does not meet all inclusion/exclusion criteria; however, the screen failure reason is not "Did not meet eligibility criteria". Please confirm or update as appropriate.',
          },
        ],
      },
      {
        id: '138',
        lineNum: '7',
        cases: [
          {
            id: '',
            field: 'Please specify the reason for screen failure',
            fieldType: 'RadioButton (Vertical)',
            relateFields: [
              {
                name: 'Was the subject ENROLLED?',
                value: 'Yes',
              },
            ],
            testValue: '',
            testValueIsBlank: false,
            expectedResult: 'open',
            queryMessage: '"Was the subject ENROLLED?" is "Yes"; however, this field is not blank. Please confirm or update as appropriate.',
          },
        ],
      },
      {
        id: '139',
        lineNum: '8',
        cases: [
          {
            id: '',
            field: 'Treatment Group',
            fieldType: 'RadioButton (Vertical)',
            relateFields: [
              {
                name: 'Was the subject ENROLLED?',
                value: 'No',
              },
            ],
            testValue: '',
            testValueIsBlank: false,
            expectedResult: 'open',
            queryMessage: '"Was the subject ENROLLED?" is "No"; however, this field is not blank. Please confirm or update as appropriate.',
          },
        ],
      },
    ],
  },
];
