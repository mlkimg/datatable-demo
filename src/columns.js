export default [
  {field: 'Desired Flexibility', label: 'Desired Flexibiity', width: 90, sortable: true},
  {field: 'Style_Complex', label: 'Style Complex', width: 130},
  {field: 'Style_Num', label: 'Style #', width: 80},
  {field: 'CC_Num', label: 'CC #', width: 70},
  {field: 'Market', label: 'Market', width: 80},
  {field: 'RD_Num', label: 'RD Number', width: 90},
  {field: 'Fabric_Description', label: 'Fabric Description', width: 250},
  {field: 'Desired_RR_Flexibility', label: 'Flexibility', width: 120},
  {field: 'Status', label: 'Status', width: 90},
  {field: 'InDC_Date', label: 'INDC Date', width: 120},
  {field: 'Current_Units', label: 'Current Units', width: 100},
  {field: 'Locked_Units', label: 'Locked Units', width: 100},
  {
    label: 'Trigger Date',
    children: [
      {field: 'monthly_book_trigger_datee', label: 'Monthly Book', width: 100},
      {field: 'gis_unit_flex_trigger_date', label: 'Unit Flex Trigger Date', width: 150},
      {field: 'color_trigger_date', label: 'Color/Wash', width: 100},
      {field: 'body_trigger_date', label: 'Body', width: 100},
      {field: 'graphic_trigger_date', label: 'Graphic', width: 100}
    ]
  }
]
