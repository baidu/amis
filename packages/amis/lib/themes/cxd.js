"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.classnames = exports.classPrefix = void 0;
var theme_1 = require("../theme");
exports.classPrefix = 'cxd-';
exports.classnames = (0, theme_1.makeClassnames)(exports.classPrefix);
// yunshe.design 百度云舍
(0, theme_1.theme)('cxd', {
    classPrefix: 'cxd-',
    components: {
        toast: {
            closeButton: true
        }
    },
    renderers: {
        'form': {
            horizontal: {
                leftFixed: true
            }
        },
        'pagination': {
            maxButtons: 9,
            showPageInput: false
        },
        'fieldset': {
            collapsable: false
        },
        'remark': {
            placement: 'right'
        },
        'tabs': {
            mode: 'line'
        },
        'tabs-control': {
            mode: 'line'
        },
        'range-control': {
            showInput: true,
            clearable: true
        },
        'chart': {
            chartTheme: {
                color: [
                    '#108cee',
                    '#545fc8',
                    '#f38900',
                    '#ea2e2e',
                    '#8a58bc',
                    '#04c1ba',
                    '#fbbe04',
                    '#5fb333',
                    '#0a7eb4',
                    '#304069',
                    '#c4ccd3'
                ],
                backgroundColor: '#ffffff',
                textStyle: {},
                title: {
                    textStyle: {
                        color: '#333'
                    },
                    subtextStyle: {
                        color: '#999999'
                    }
                },
                line: {
                    itemStyle: {
                        borderWidth: 1
                    },
                    lineStyle: {
                        width: 2
                    },
                    symbolSize: 4,
                    symbol: 'emptyCircle',
                    smooth: false
                },
                radar: {
                    itemStyle: {
                        borderWidth: 1
                    },
                    lineStyle: {
                        width: 2
                    },
                    symbolSize: 4,
                    symbol: 'emptyCircle',
                    smooth: false
                },
                bar: {
                    itemStyle: {
                        barBorderWidth: 0,
                        barBorderColor: '#ccc'
                    }
                },
                pie: {
                    itemStyle: {
                        borderWidth: 0,
                        borderColor: '#ccc'
                    }
                },
                scatter: {
                    itemStyle: {
                        borderWidth: 0,
                        borderColor: '#ccc'
                    }
                },
                boxplot: {
                    itemStyle: {
                        borderWidth: 0,
                        borderColor: '#ccc'
                    }
                },
                parallel: {
                    itemStyle: {
                        borderWidth: 0,
                        borderColor: '#ccc'
                    }
                },
                sankey: {
                    itemStyle: {
                        borderWidth: 0,
                        borderColor: '#ccc'
                    }
                },
                funnel: {
                    itemStyle: {
                        borderWidth: 0,
                        borderColor: '#ccc'
                    }
                },
                gauge: {
                    itemStyle: {
                        borderWidth: 0,
                        borderColor: '#ccc'
                    }
                },
                candlestick: {
                    itemStyle: {
                        color: '#c23531',
                        color0: '#314656',
                        borderColor: '#c23531',
                        borderColor0: '#314656',
                        borderWidth: 1
                    }
                },
                graph: {
                    itemStyle: {
                        borderWidth: 0,
                        borderColor: '#ccc'
                    },
                    lineStyle: {
                        width: 1,
                        color: '#aaa'
                    },
                    symbolSize: 4,
                    symbol: 'emptyCircle',
                    smooth: false,
                    color: [
                        '#108cee',
                        '#545fc8',
                        '#f38900',
                        '#ea2e2e',
                        '#8a58bc',
                        '#04c1ba',
                        '#fbbe04',
                        '#5fb333',
                        '#0a7eb4',
                        '#304069',
                        '#c4ccd3'
                    ],
                    label: {
                        color: '#f5f5f5'
                    }
                },
                map: {
                    itemStyle: {
                        normal: {
                            areaColor: '#eee',
                            borderColor: '#444',
                            borderWidth: 0.5
                        },
                        emphasis: {
                            areaColor: 'rgba(255,215,0,0.8)',
                            borderColor: '#444',
                            borderWidth: 1
                        }
                    },
                    label: {
                        normal: {
                            textStyle: {
                                color: '#000'
                            }
                        },
                        emphasis: {
                            textStyle: {
                                color: 'rgb(100,0,0)'
                            }
                        }
                    }
                },
                geo: {
                    itemStyle: {
                        normal: {
                            areaColor: '#eee',
                            borderColor: '#444',
                            borderWidth: 0.5
                        },
                        emphasis: {
                            areaColor: 'rgba(255,215,0,0.8)',
                            borderColor: '#444',
                            borderWidth: 1
                        }
                    },
                    label: {
                        normal: {
                            textStyle: {
                                color: '#000'
                            }
                        },
                        emphasis: {
                            textStyle: {
                                color: 'rgb(100,0,0)'
                            }
                        }
                    }
                },
                categoryAxis: {
                    axisLine: {
                        show: true,
                        lineStyle: {
                            color: '#999999'
                        }
                    },
                    axisTick: {
                        show: true,
                        lineStyle: {
                            color: '#999999'
                        }
                    },
                    axisLabel: {
                        show: true,
                        textStyle: {
                            color: '#999999'
                        }
                    },
                    splitLine: {
                        show: false,
                        lineStyle: {
                            color: ['#ccc']
                        }
                    },
                    splitArea: {
                        show: false,
                        areaStyle: {
                            color: ['rgba(250,250,250,0.3)', 'rgba(200,200,200,0.3)']
                        }
                    }
                },
                valueAxis: {
                    axisLine: {
                        show: true,
                        lineStyle: {
                            color: '#999999'
                        }
                    },
                    axisTick: {
                        show: true,
                        lineStyle: {
                            color: '#999999'
                        }
                    },
                    axisLabel: {
                        show: true,
                        textStyle: {
                            color: '#999999'
                        }
                    },
                    splitLine: {
                        show: true,
                        lineStyle: {
                            color: ['#eeeeee']
                        }
                    },
                    splitArea: {
                        show: false,
                        areaStyle: {
                            color: ['rgba(250,250,250,0.3)', 'rgba(200,200,200,0.3)']
                        }
                    }
                },
                logAxis: {
                    axisLine: {
                        show: true,
                        lineStyle: {
                            color: '#999999'
                        }
                    },
                    axisTick: {
                        show: true,
                        lineStyle: {
                            color: '#999999'
                        }
                    },
                    axisLabel: {
                        show: true,
                        textStyle: {
                            color: '#999999'
                        }
                    },
                    splitLine: {
                        show: true,
                        lineStyle: {
                            color: ['#eeeeee']
                        }
                    },
                    splitArea: {
                        show: false,
                        areaStyle: {
                            color: ['rgba(250,250,250,0.3)', 'rgba(200,200,200,0.3)']
                        }
                    }
                },
                timeAxis: {
                    axisLine: {
                        show: true,
                        lineStyle: {
                            color: '#999999'
                        }
                    },
                    axisTick: {
                        show: true,
                        lineStyle: {
                            color: '#999999'
                        }
                    },
                    axisLabel: {
                        show: true,
                        textStyle: {
                            color: '#999999'
                        }
                    },
                    splitLine: {
                        show: true,
                        lineStyle: {
                            color: ['#eeeeee']
                        }
                    },
                    splitArea: {
                        show: false,
                        areaStyle: {
                            color: ['rgba(250,250,250,0.3)', 'rgba(200,200,200,0.3)']
                        }
                    }
                },
                toolbox: {
                    iconStyle: {
                        normal: {
                            borderColor: '#999'
                        },
                        emphasis: {
                            borderColor: '#666'
                        }
                    }
                },
                legend: {
                    textStyle: {
                        color: '#333'
                    }
                },
                tooltip: {
                    axisPointer: {
                        lineStyle: {
                            color: '#ccc',
                            width: 1
                        },
                        crossStyle: {
                            color: '#ccc',
                            width: 1
                        }
                    }
                },
                timeline: {
                    lineStyle: {
                        color: '#293c55',
                        width: 1
                    },
                    itemStyle: {
                        normal: {
                            color: '#293c55',
                            borderWidth: 1
                        },
                        emphasis: {
                            color: '#a9334c'
                        }
                    },
                    controlStyle: {
                        normal: {
                            color: '#293c55',
                            borderColor: '#293c55',
                            borderWidth: 0.5
                        },
                        emphasis: {
                            color: '#293c55',
                            borderColor: '#293c55',
                            borderWidth: 0.5
                        }
                    },
                    checkpointStyle: {
                        color: '#e43c59',
                        borderColor: 'rgba(194,53,49, 0.5)'
                    },
                    label: {
                        normal: {
                            textStyle: {
                                color: '#293c55'
                            }
                        },
                        emphasis: {
                            textStyle: {
                                color: '#293c55'
                            }
                        }
                    }
                },
                visualMap: {
                    color: ['#bf444c', '#d88273', '#f6efa6']
                },
                dataZoom: {
                    backgroundColor: 'rgba(47,69,84,0)',
                    dataBackgroundColor: 'rgba(47,69,84,0.3)',
                    fillerColor: 'rgba(167,183,204,0.4)',
                    handleColor: '#a7b7cc',
                    handleSize: '100%',
                    textStyle: {
                        color: '#333'
                    }
                },
                markPoint: {
                    label: {
                        color: '#f5f5f5'
                    },
                    emphasis: {
                        label: {
                            color: '#f5f5f5'
                        }
                    }
                }
            }
        }
    }
});
//# sourceMappingURL=./themes/cxd.js.map
