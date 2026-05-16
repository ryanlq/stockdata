async function fetchCoopHolderIds({
  holderId,
  endDate = "2026-03-31",
  pageSize = 500,
}) {
  const allRows = [];

  let page = 1;

  while (true) {
    console.log(`抓取第 ${page} 页`);

    const params = new URLSearchParams({
      reportName: "RPT_F10_COOPFREEHOLDER",

      columns: "ALL",

      filter: `(HOLDER_NEW="${holderId}")` + `(END_DATE='${endDate}')`,

      pageNumber: page,

      pageSize: pageSize,

      sortTypes: "1,-1",

      sortColumns: "COOPERAT_HOLDER_NEW,TOTAL_HOLD_RATIO",

      source: "Datacenter",

      client: "PC",

      v: Math.random().toString().slice(2),
    });

    const url = `https://datacenter.eastmoney.com/securities/api/data/v1/get?${params}`;

    const resp = await fetch(url);

    const json = await resp.json();

    const rows = json?.result?.data || [];

    if (!rows.length) {
      break;
    }

    allRows.push(...rows);

    if (rows.length < pageSize) {
      break;
    }

    page++;
  }

  console.log(`总记录数: ${allRows.length}`);

  // 去重
  const holderMap = {};

  for (const row of allRows) {
    // 主机构
    if (row.HOLDER_NEW && row.HOLDER_NAME) {
      holderMap[row.HOLDER_NEW] = row.HOLDER_NAME;
    }

    // 关联机构
    if (row.COOPERAT_HOLDER_NEW && row.COOPERAT_HOLDER_NAME) {
      holderMap[row.COOPERAT_HOLDER_NEW] = row.COOPERAT_HOLDER_NAME;
    }
  }

  console.table(holderMap);

  // 输出 JS 常量
  const js = `const HOLDERS = ${JSON.stringify(holderMap, null, 2)};`;

  console.log(js);

  return holderMap;
}
