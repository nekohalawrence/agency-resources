---
Created date: 2025-02-07 00:41
Modified date: 2025-08-28 12:09
---
# GEODATA

- 地理位置相关的数据，通常用于根据地理位置管理网络流量。

**DAT 和 MMDB 文件**
- 是存储 IP 地址和地理位置信息的数据文件，其中 MMDB 是一种更高效的格式，广泛应用于需要快速查询和精确地理位置信息的场景中。

## geosite 和 geoip

> geoip: 基于 IP 地址的地理位置数据库。主要用于根据 IP 地址的地理位置来路由或限制流量。
> geosite: 基于域名的地理位置和类别分类数据库。主要用于根据域名类别来路由或管理流量。

| 数据类型  | 项目名称                                                                              | 介绍                                                                                                                                                                                                                                                                                                | 地理区域 |
| ----- | --------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---- |
| 综合    | [geo - MetaCubeX](https://github.com/MetaCubeX/geo)                               | 🗺An easy way to manage all your Geo resources. Available as both a CLI and a Go library.                                                                                                                                                                                                         | 综合   |
| 综合    | [meta-rules-dat - MetaCubeX](https://github.com/MetaCubeX/meta-rules-dat)         | rules-dat for mihomo                                                                                                                                                                                                                                                                              | 综合   |
| 综合    | [ruleset_geodata - DustinWin](https://github.com/DustinWin/ruleset_geodata)       | 定制适合 Clash 内核、mihomo 内核和 sing-box 内核的 ruleset&geodata 文件                                                                                                                                                                                                                                          | 综合   |
| 综合    | [v2ray-rules-dat - Loyalsoldier](https://github.com/Loyalsoldier/v2ray-rules-dat) | 🦄 🎃 👻 V2Ray 路由规则文件加强版，可代替 V2Ray 官方 geoip.dat 和 geosite.dat，适用于 V2Ray、Xray-core、mihomo(Clash-Meta)、hysteria、Trojan-Go 和 leaf。Enhanced edition of V2Ray rules dat files, applicable to V2Ray, Xray-core, mihomo(Clash-Meta), hysteria, Trojan-Go and leaf.                                       | 综合   |
| geoip | [geoip- Loyalsoldier](https://github.com/Loyalsoldier/geoip)                      | 🌚 🌍 🌝 GeoIP 规则文件加强版，支持自行定制 V2Ray dat 格式文件 geoip.dat、MaxMind mmdb 格式文件、sing-box SRS 格式文件、mihomo MRS 格式文件、Clash ruleset、Surge ruleset 等。Enhanced edition of GeoIP files for V2Ray, Xray-core, sing-box, Clash, mihomo, Shadowrocket, Quantumult X, Surge, hysteria, Trojan-Go, Leaf, Nginx, etc. | 综合   |
| geoip | [Hackl0us](https://github.com/Hackl0us/GeoIP2-CN/)                                | 🇨🇳 小巧精悍、准确、实用 GeoIP2 数据库 🇨🇳                                                                                                                                                                                                                                                                   | CN   |
| geoip | [NobyDa](https://github.com/NobyDa/geoip)                                         | 用于代理工具的 GeoIPCN 的增强版。                                                                                                                                                                                                                                                                             | CN   |

## ASN

| 项目名称                                                        | 介绍  |
| ----------------------------------------------------------- | --- |
| [Loon0x00/loon_data](https://gitlab.com/Loon0x00/loon_data) |     |
