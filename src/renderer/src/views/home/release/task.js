/*
 * @Description:
 * @Author: zby
 * @Date: 2023-11-22 16:08:49
 * @LastEditors: zby
 * @Reference:
 */
export const task1 = {
  lineNum: '30',
  uuid: 'D_AENO\nD_AENO01\nD_AENO02\n-All visits-Prior/Concomitant Medication-Related Adverse Event#',
  visit: '既往/合并用药 ',
  form: '既往/合并用药',
  field: 'Related Adverse Event#',
  type: 'Dynamic Search list',
  testValue: '1 - headache-24 May 2013',
  sourceVisit: 'All visits',
  desc: {
    conditions: {
      logic: 'and',
      conditions: [
        {
          field: 'Adverse Event Term',
          fieldAction: '',
          fieldValue: ['headache'],
          locations: [
            {
              adposition: 'on',
              locateName: 'Adverse Events',
              locateField: 'visit',
              locateType: 'desc',
            },
            {
              adposition: 'on',
              locateName: 'Adverse Events',
              locateField: 'form',
              locateType: 'desc',
            },
            {
              adposition: 'at',
              locateName: '1',
              locateField: 'line',
              locateType: 'desc',
            },
          ],
        },
        {
          field: 'Onset Date',
          fieldAction: '',
          fieldValue: ['24 May 2013'],
          locations: [
            {
              adposition: 'on',
              locateName: 'Adverse Events',
              locateField: 'visit',
              locateType: 'desc',
            },
            {
              adposition: 'on',
              locateName: 'Adverse Events',
              locateField: 'form',
              locateType: 'desc',
            },
            {
              adposition: 'at',
              locateName: '1',
              locateField: 'line',
              locateType: 'desc',
            },
          ],
        },
        {
          field: 'Save',
          fieldAction: 'click',
          fieldValue: [],
          locations: [
            {
              adposition: 'on',
              locateName: 'Adverse Events',
              locateField: 'visit',
              locateType: 'desc',
            },
            {
              adposition: 'on',
              locateName: 'Adverse Events',
              locateField: 'form',
              locateType: 'desc',
            },
          ],
        },
      ],
    },
    action: 'displays',
    targets: [
      {
        fieldType: 'records',
        fields: ['Related Adverse Event#'],
        subType: '',
        subs: ['1 - headache-24 May 2013'],
        parType: 'form',
        parent: 'Prior/Concomitant Medication',
      },
    ],
  },
};

export const task2 = {
  lineNum: '4',
  uuid: 'e817715cc375e3773f6b874d51a1bf55',
  visit: 'Screening',
  form: '准入',
  field: 'Was the subject ADMITTED?',
  type: 'Dynamic Folders',
  testValue: 'Yes',
  sourceVisit: 'Screening',
  desc: {
    conditions: {
      logic: 'and',
      conditions: [
        {
          field: '受试者是否获准入组？',
          fieldAction: '',
          fieldValue: ['Yes'],
          locations: [
            {
              adposition: 'on',
              locateName: 'Screening',
              locateField: 'visit',
              locateType: 'sds',
            },
            {
              adposition: 'on',
              locateName: '准入',
              locateField: 'form',
              locateType: 'sds',
            },
          ],
          fieldType: 'RadioButton (Vertical)',
        },
      ],
    },
    action: 'trigger',
    targets: [
      {
        fieldType: 'folder',
        fields: ['D-1'],
        subType: 'form',
        subs: ['Visit Date', 'Inclusion/Exclusion', 'Eligibility'],
        parType: '',
        parent: '',
      },
    ],
  },
};

export const tasks = [
  {
    lineNum: '3',
    uuid: '48371aa222a72ffdda782738622e64f7',
    visit: '/',
    form: 'New Subject',
    field: 'Screening Number',
    type: 'Dynamic Folders',
    testValue: '115',
    sourceVisit: '/',
    desc: {
      conditions: {
        logic: 'and',
        conditions: [
          {
            field: 'Screening Number',
            fieldAction: '',
            fieldValue: ['present'],
            locations: [
              {
                adposition: 'on',
                locateName: '/',
                locateField: 'visit',
                locateType: 'current',
              },
              {
                adposition: 'on',
                locateName: 'New Subject',
                locateField: 'form',
                locateType: 'current',
              },
            ],
            fieldType: '',
          },
        ],
      },
      action: 'trigger',
      targets: [
        {
          fieldType: 'folder',
          fields: ['Screening'],
          subType: 'form',
          subs: ['Visit Date', 'Informed Consent', 'Demographics', 'Inclusion/Exclusion', '准入'],
          parType: '',
          parent: '',
        },
        {
          fieldType: 'folder',
          fields: ['Adverse Events'],
          subType: 'form',
          subs: ['Adverse Events'],
          parType: '',
          parent: '',
        },
      ],
    },
  },
  {
    lineNum: '4',
    uuid: 'e817715cc375e3773f6b874d51a1bf55',
    visit: 'Screening',
    form: '准入',
    field: 'Was the subject ADMITTED?',
    type: 'Dynamic Folders',
    testValue: 'Yes',
    sourceVisit: 'Screening',
    desc: {
      conditions: {
        logic: 'and',
        conditions: [
          {
            field: '受试者是否获准入组？',
            fieldAction: '',
            fieldValue: ['Yes'],
            locations: [
              {
                adposition: 'on',
                locateName: 'Screening',
                locateField: 'visit',
                locateType: 'sds',
              },
              {
                adposition: 'on',
                locateName: '准入',
                locateField: 'form',
                locateType: 'sds',
              },
            ],
            fieldType: 'RadioButton (Vertical)',
          },
        ],
      },
      action: 'trigger',
      targets: [
        {
          fieldType: 'folder',
          fields: ['D-1'],
          subType: 'form',
          subs: ['Visit Date', 'Inclusion/Exclusion', 'Eligibility'],
          parType: '',
          parent: '',
        },
      ],
    },
  },
  {
    lineNum: '5',
    uuid: 'dfb46e152fbddb78a6aa28cde96fa1a6',
    visit: 'D-1',
    form: 'Eligibility',
    field: 'Was the subject ENROLLED?',
    type: 'Dynamic Fields',
    testValue: 'Yes',
    sourceVisit: 'D-1',
    desc: {
      conditions: {
        logic: 'and',
        conditions: [
          {
            field: 'Was the subject ENROLLED?',
            fieldAction: '',
            fieldValue: ['Yes'],
            locations: [
              {
                adposition: 'on',
                locateName: 'D-1',
                locateField: 'visit',
                locateType: 'sds',
              },
              {
                adposition: 'on',
                locateName: 'Eligibility',
                locateField: 'form',
                locateType: 'sds',
              },
            ],
            fieldType: 'RadioButton (Vertical)',
          },
        ],
      },
      action: 'trigger',
      targets: [
        {
          fieldType: 'item',
          fields: ['Treatment Group'],
          subType: '',
          subs: [],
          parType: '',
          parent: '',
        },
      ],
    },
  },
  {
    lineNum: '6',
    uuid: 'dfb46e152fbddb78a6aa28cde96fa1a6',
    visit: 'D-1',
    form: 'Eligibility',
    field: 'Was the subject ENROLLED?',
    type: 'Dynamic Fields',
    testValue: 'No',
    sourceVisit: 'D-1',
    desc: {
      conditions: {
        logic: 'and',
        conditions: [
          {
            field: 'Was the subject ENROLLED?',
            fieldAction: '',
            fieldValue: ['No'],
            locations: [
              {
                adposition: 'on',
                locateName: 'D-1',
                locateField: 'visit',
                locateType: 'sds',
              },
              {
                adposition: 'on',
                locateName: 'Eligibility',
                locateField: 'form',
                locateType: 'sds',
              },
            ],
            fieldType: 'RadioButton (Vertical)',
          },
        ],
      },
      action: 'trigger',
      targets: [
        {
          fieldType: 'item',
          fields: ['Please specify the reason for screen failure'],
          subType: '',
          subs: [],
          parType: '',
          parent: '',
        },
      ],
    },
  },
];
