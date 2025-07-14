const run = async () => {
  require('./computeTotals.test');
  require('./mru.test');
  require('./persist.test');
  require('./scaleEntry.test');
  require('./parseUnitNumber.test');
  require('./defaultUnit.test');
  require('./history.test');
  require('./updateDatalist.test');
  require('./loadDiary.test');
  require('./renderTotals.test');
  require('./renderDiaryTable.test');
  require('./escapeFoodName.test');
  require('./importExport.test');
  require('./importFoods.test');
  await require('./domButton.test')();
  await require('./domDiary.test')();
  await require('./domSaveDay.test')();
  await require('./domFileTransfer.test')();
  await require('./domImportFoods.test')();
  console.log('All tests passed');
};

run();
