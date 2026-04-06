export interface PlotData {
  id: number;
  number: string;
  x: number;
  y: number;
  w: number;
  h: number;
  status: 'available' | 'sold' | 'corner';
  area: number;
  price: string;
  facing: string;
  roadWidth: string;
  type: string;
}

export const PLOTS: PlotData[] = [
  // ─── GROUP 1: Far Left — Plots 114-101 ───────────────────────────────
  { id:1,  number:'114', x:90,  y:340, w:130, h:68, status:'available', area:900,  price:'₹175K', facing:'East',  roadWidth:'12M', type:'corner'    },
  { id:2,  number:'113', x:90,  y:415, w:130, h:68, status:'available', area:900,  price:'₹165K', facing:'East',  roadWidth:'12M', type:'regular'   },
  { id:3,  number:'112', x:90,  y:490, w:130, h:68, status:'sold',      area:900,  price:'₹165K', facing:'East',  roadWidth:'12M', type:'regular'   },
  { id:4,  number:'111', x:90,  y:565, w:130, h:68, status:'available', area:900,  price:'₹165K', facing:'East',  roadWidth:'12M', type:'regular'   },
  { id:5,  number:'110', x:90,  y:640, w:130, h:68, status:'sold',      area:900,  price:'₹165K', facing:'East',  roadWidth:'12M', type:'regular'   },
  { id:6,  number:'109', x:90,  y:715, w:130, h:68, status:'available', area:900,  price:'₹165K', facing:'East',  roadWidth:'12M', type:'regular'   },
  { id:7,  number:'108', x:90,  y:790, w:130, h:68, status:'corner',    area:1050, price:'₹195K', facing:'East',  roadWidth:'12M', type:'corner'    },
  { id:8,  number:'105', x:90,  y:865, w:130, h:68, status:'available', area:900,  price:'₹165K', facing:'East',  roadWidth:'12M', type:'regular'   },
  { id:9,  number:'101', x:90,  y:930, w:130, h:45, status:'sold',      area:800,  price:'₹155K', facing:'East',  roadWidth:'12M', type:'regular'   },

  // ─── GROUP 2: Plots 86-100 ───────────────────────────────────────────
  { id:10, number:'93',  x:235, y:340, w:130, h:68, status:'available', area:900,  price:'₹168K', facing:'West', roadWidth:'12M', type:'regular'    },
  { id:11, number:'92',  x:235, y:415, w:130, h:68, status:'sold',      area:900,  price:'₹168K', facing:'West', roadWidth:'12M', type:'regular'    },
  { id:12, number:'92b', x:235, y:490, w:130, h:68, status:'available', area:900,  price:'₹168K', facing:'West', roadWidth:'12M', type:'regular'    },
  { id:13, number:'91',  x:235, y:565, w:130, h:68, status:'corner',    area:1000, price:'₹185K', facing:'West', roadWidth:'12M', type:'corner'     },
  { id:14, number:'90',  x:235, y:640, w:130, h:68, status:'sold',      area:900,  price:'₹168K', facing:'West', roadWidth:'12M', type:'regular'    },
  { id:15, number:'99',  x:235, y:715, w:130, h:68, status:'available', area:900,  price:'₹168K', facing:'West', roadWidth:'12M', type:'regular'    },
  { id:16, number:'100', x:235, y:790, w:130, h:68, status:'sold',      area:900,  price:'₹168K', facing:'West', roadWidth:'12M', type:'regular'    },
  { id:17, number:'103', x:235, y:865, w:130, h:68, status:'available', area:900,  price:'₹168K', facing:'West', roadWidth:'12M', type:'regular'    },
  { id:18, number:'102', x:235, y:930, w:130, h:45, status:'available', area:800,  price:'₹155K', facing:'West', roadWidth:'12M', type:'regular'    },
  { id:20, number:'86',  x:235, y:340, w:130, h:68, status:'available', area:900,  price:'₹168K', facing:'East', roadWidth:'12M', type:'regular'    },
  { id:21, number:'97',  x:235, y:415, w:130, h:68, status:'sold',      area:900,  price:'₹168K', facing:'East', roadWidth:'12M', type:'regular'    },

  // ─── GROUP 3: Plots 76-83 ─────────────────
  { id:30, number:'76',  x:520, y:340, w:110, h:62, status:'corner',    area:1000, price:'₹188K', facing:'North',roadWidth:'12M', type:'corner'     },
  { id:31, number:'75',  x:520, y:340, w:110, h:62, status:'available', area:950,  price:'₹178K', facing:'North',roadWidth:'12M', type:'road-facing'},
  { id:32, number:'78',  x:520, y:410, w:110, h:62, status:'sold',      area:900,  price:'₹168K', facing:'East', roadWidth:'12M', type:'regular'    },
  { id:33, number:'78b', x:520, y:480, w:110, h:62, status:'available', area:900,  price:'₹168K', facing:'East', roadWidth:'12M', type:'regular'    },
  { id:34, number:'79',  x:520, y:550, w:110, h:62, status:'corner',    area:1000, price:'₹185K', facing:'East', roadWidth:'12M', type:'corner'     },
  { id:35, number:'80',  x:520, y:620, w:110, h:62, status:'sold',      area:900,  price:'₹168K', facing:'East', roadWidth:'12M', type:'regular'    },
  { id:36, number:'81',  x:520, y:690, w:110, h:62, status:'available', area:900,  price:'₹168K', facing:'East', roadWidth:'12M', type:'regular'    },
  { id:37, number:'82',  x:520, y:760, w:110, h:62, status:'sold',      area:900,  price:'₹168K', facing:'East', roadWidth:'12M', type:'regular'    },
  { id:38, number:'83',  x:520, y:830, w:110, h:62, status:'available', area:900,  price:'₹168K', facing:'East', roadWidth:'12M', type:'regular'    },
  { id:39, number:'64',  x:520, y:900, w:110, h:62, status:'corner',    area:1050, price:'₹195K', facing:'East', roadWidth:'12M', type:'corner'     },
  { id:40, number:'71',  x:640, y:340, w:110, h:62, status:'available', area:900,  price:'₹168K', facing:'West', roadWidth:'12M', type:'road-facing'},
  { id:41, number:'72',  x:640, y:410, w:110, h:62, status:'sold',      area:900,  price:'₹168K', facing:'West', roadWidth:'12M', type:'regular'    },
  { id:42, number:'70b', x:640, y:480, w:110, h:62, status:'available', area:900,  price:'₹168K', facing:'West', roadWidth:'12M', type:'regular'    },
  { id:43, number:'69',  x:640, y:550, w:110, h:62, status:'corner',    area:1000, price:'₹185K', facing:'West', roadWidth:'12M', type:'corner'     },
  { id:44, number:'68',  x:640, y:620, w:110, h:62, status:'sold',      area:900,  price:'₹168K', facing:'West', roadWidth:'12M', type:'regular'    },
  { id:45, number:'67',  x:640, y:690, w:110, h:62, status:'available', area:900,  price:'₹168K', facing:'West', roadWidth:'12M', type:'regular'    },
  { id:46, number:'66',  x:640, y:760, w:110, h:62, status:'sold',      area:900,  price:'₹168K', facing:'West', roadWidth:'12M', type:'regular'    },
  { id:47, number:'65',  x:640, y:830, w:110, h:62, status:'available', area:900,  price:'₹168K', facing:'West', roadWidth:'12M', type:'regular'    },

  // ─── GROUP 4: Plots 57-63 ─────────────────────
  { id:50, number:'57',  x:770, y:340, w:105, h:60, status:'available', area:900,  price:'₹170K', facing:'North',roadWidth:'9M',  type:'road-facing'},
  { id:53, number:'58',  x:770, y:410, w:105, h:60, status:'corner',    area:1000, price:'₹188K', facing:'East', roadWidth:'9M',  type:'corner'     },
  { id:54, number:'59',  x:770, y:480, w:105, h:60, status:'sold',      area:900,  price:'₹168K', facing:'East', roadWidth:'9M',  type:'regular'    },
  { id:55, number:'60',  x:770, y:550, w:105, h:60, status:'available', area:900,  price:'₹168K', facing:'East', roadWidth:'9M',  type:'regular'    },
  { id:56, number:'61',  x:770, y:620, w:105, h:60, status:'sold',      area:900,  price:'₹168K', facing:'East', roadWidth:'9M',  type:'regular'    },
  { id:58, number:'62',  x:770, y:760, w:105, h:60, status:'corner',    area:1000, price:'₹185K', facing:'East', roadWidth:'9M',  type:'corner'     },
  { id:60, number:'63',  x:770, y:830, w:105, h:60, status:'available', area:900,  price:'₹168K', facing:'East', roadWidth:'9M',  type:'regular'    },
  { id:61, number:'53',  x:870, y:410, w:105, h:60, status:'sold',      area:900,  price:'₹168K', facing:'West', roadWidth:'9M',  type:'regular'    },
  { id:62, number:'52',  x:870, y:480, w:105, h:60, status:'available', area:900,  price:'₹168K', facing:'West', roadWidth:'9M',  type:'regular'    },
  { id:63, number:'51',  x:870, y:550, w:105, h:60, status:'corner',    area:1000, price:'₹188K', facing:'West', roadWidth:'9M',  type:'corner'     },
  { id:64, number:'50',  x:870, y:620, w:105, h:60, status:'sold',      area:900,  price:'₹168K', facing:'West', roadWidth:'9M',  type:'regular'    },

  // ─── GROUP 5: Plots 43-49 ──────────────────────
  { id:70, number:'43',  x:1050, y:340, w:100, h:58, status:'available', area:900, price:'₹172K', facing:'North',roadWidth:'8M', type:'road-facing' },
  { id:73, number:'44',  x:1050, y:410, w:100, h:58, status:'corner',   area:1000, price:'₹190K', facing:'East', roadWidth:'8M', type:'corner'      },
  { id:74, number:'45',  x:1050, y:475, w:100, h:58, status:'sold',      area:900, price:'₹168K', facing:'East', roadWidth:'8M', type:'regular'     },
  { id:75, number:'46',  x:1050, y:540, w:100, h:58, status:'available', area:900, price:'₹168K', facing:'East', roadWidth:'8M', type:'regular'     },
  { id:76, number:'47',  x:1050, y:605, w:100, h:58, status:'sold',      area:900, price:'₹168K', facing:'East', roadWidth:'8M', type:'regular'     },
  { id:78, number:'40',  x:1150, y:410, w:100, h:58, status:'sold',      area:900, price:'₹168K', facing:'West', roadWidth:'8M', type:'regular'     },
  { id:79, number:'39',  x:1150, y:475, w:100, h:58, status:'available', area:900, price:'₹168K', facing:'West', roadWidth:'8M', type:'regular'     },
  { id:80, number:'38',  x:1150, y:540, w:100, h:58, status:'corner',   area:1000, price:'₹188K', facing:'West', roadWidth:'8M', type:'corner'      },

  // ─── GROUP 6: Plots 31-35 ──────────────────────────
  { id:90, number:'31',  x:1320, y:340, w:100, h:58, status:'available', area:900, price:'₹175K', facing:'North',roadWidth:'8M', type:'road-facing' },
  { id:93, number:'28',  x:1320, y:410, w:100, h:58, status:'corner',   area:1000, price:'₹192K', facing:'East', roadWidth:'8M', type:'corner'      },
  { id:94, number:'27',  x:1320, y:475, w:100, h:58, status:'sold',      area:900, price:'₹168K', facing:'East', roadWidth:'8M', type:'regular'     },
  { id:95, number:'26',  x:1320, y:540, w:100, h:58, status:'available', area:900, price:'₹168K', facing:'East', roadWidth:'8M', type:'regular'     },

  // ─── GROUP 7: Plots 18-22 ──────────────────────────
  { id:110,number:'18',  x:1600, y:340, w:95,  h:55, status:'available', area:900, price:'₹178K', facing:'North',roadWidth:'9M', type:'road-facing' },
  { id:112,number:'16',  x:1600, y:340, w:95,  h:55, status:'corner',   area:1050, price:'₹198K', facing:'North',roadWidth:'9M', type:'corner'      },
  { id:113,number:'15',  x:1600, y:410, w:95,  h:55, status:'available', area:900, price:'₹168K', facing:'East', roadWidth:'9M', type:'regular'     },

  // ─── GROUP 8: Right section — Plots 1-18 ────────────────────────
  { id:130,number:'18b', x:1890, y:340, w:85,  h:52, status:'available', area:850, price:'₹180K', facing:'North',roadWidth:'9M', type:'road-facing' },
  { id:133,number:'12b', x:1890, y:340, w:85,  h:52, status:'corner',   area:950,  price:'₹195K', facing:'North',roadWidth:'9M', type:'corner'      },
  { id:145,number:'1b',  x:1890, y:410, w:85,  h:52, status:'available', area:850, price:'₹168K', facing:'East', roadWidth:'9M', type:'regular'     },
];
