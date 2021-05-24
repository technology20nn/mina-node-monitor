import 'regenerator-runtime/runtime' // this required for Parcel
import {getInfo} from "./helpers/get-info"
import {getFakeData} from "./helpers/get-fake-data";
import {defaultChartConfig, defaultGaugeConfig} from "./helpers/chart-config";
import {imgOk, imgStop} from "./helpers/const";

let cpuChart, cpuGauge, cpuSegment

export const processCPUData = async () => {
    const elLog = $("#log-cpu")
    elLog.html(imgStop)

    let container = $("#cpu-load-all")
    let height = 208

    if (!cpuGauge) {
        cpuGauge = chart.gauge('#cpu-use', [0], {
            ...defaultGaugeConfig,
            backStyle: globalThis.darkMode ? '#1e2228' : '#f0f6fc',
            padding: 0,
            onDrawValue: (v, p) => {
                return +p.toFixed(0) + "%"
            }
        })
    }

    if (!cpuChart) {
        cpuChart = chart.areaChart("#cpu-load", [
            {
                name: "CPU usage",
                data: getFakeData(40)
            }
        ], {
            ...defaultChartConfig,
            colors: [Metro.colors.toRGBA('#00AFF0', .5), Metro.colors.toRGBA('#aa00ff', .5)],
            legend: false,
            axis: {
                x: {
                    line: {
                        count: 10,
                        color: globalThis.darkMode ? '#444c56' : "#f0f6fc"
                    },
                    label: {
                        color: globalThis.darkMode ? "#fff" : "#000",
                    },
                    arrow: {
                        color: '#22272e'
                    }
                },
                y: {
                    line: {
                        count: 10,
                        color: globalThis.darkMode ? '#444c56' : "#f0f6fc"
                    },
                    label: {
                        color: globalThis.darkMode ? "#fff" : "#000",
                        font: {
                            size: 10
                        }
                    },
                    arrow: {
                        color: '#22272e'
                    }
                }
            },
            padding: {
                left: 35,
                top: 5,
                right: 0,
                bottom: 10
            },
            boundaries: {
                maxY: 100,
                minY: 0
            },
            onDrawLabelX: (v) => {
                return `${datetime(+v).format("HH:mm:ss")}`
            },
            onDrawLabelY: (v) => {
                return `${+v}%`
            }
        })
    }

    let cpuLoad = await getInfo('cpu-load')

    if (cpuLoad) {

        let {load = 0, user = 0, sys = 0, loadavg = [0, 0, 0], threads = []} = cpuLoad

        cpuChart.addPoint(0, [datetime().time(), load])
        cpuGauge.setData([load])

        $("#loadavg").html(`<span class="fg-white">${loadavg[0]}</span> <span>${loadavg[1]}</span> <span>${loadavg[2]}</span>`)

        if (!container.children().length) {
            cpuSegment = chart.segment("#cpu-load-all", cpuLoad.threads, {
                padding: {
                    top: 0,
                    bottom: 0,
                    left: 0,
                    right: 0
                },
                segment: {
                    rowDistance: 6,
                    count: 40,
                    height: height / (cpuLoad.threads.length) - 6
                },
                colors: [ [70, '#60a917'], [90, '#f0a30a'], [100, '#a20025'] ],
                border: {
                    color: "transparent"
                },
                ghost: {
                    color: globalThis.darkMode ? "rgba(125, 195, 123, .1)" : "#f0f6fc"
                }
            })
        } else {
            cpuLoad.threads.forEach( (v, i) => {
                cpuSegment.setData(v, i)
            })
        }

        elLog.html(imgOk)
    }

    setTimeout( () => processCPUData(), globalThis.config.intervals.cpu )
}
