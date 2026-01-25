const mainSelect = "🚀 节点选择"
const autoSelect = "🎃 自动选择"
const otherSelect ="🐟 漏网之鱼"
const githubProxyUrl = "https://ghproxy.net/https://raw.githubusercontent.com/"

function main(params) {
  
  initDns(params)
  initGroups(params)
  initRules(params)
  delParams(params)
  // 自定义
  microsoftRules(params)
 // myRules(params)
 console.log(params)
  return params;
}

function initGroups(params) {

  const proxies = params["proxies"].map(e => e.name)

  const groupFilter = {
    "🇭🇰 香港 自动选择" : "港|HK|Hong",
    "🇯🇵 日本 自动选择" : "日|东京|JP|Japan",
    "🇸🇬 新加坡 自动选择" : "新|坡|獅|SG|Singapore"
  }

  let auto =  Object.keys(groupFilter).map(gf =>{
    return {
      name: gf,
      type: 'url-test',
      proxies: proxies.filter(p => new RegExp(groupFilter[gf]).test(p))
    }
  }).filter(e => e.proxies.length>0)

  const proxyGroups = [
    {
      name: mainSelect,
      type: 'select',
      proxies: [autoSelect,...auto.map(e=>e.name),...proxies]
    },
    {
      name: otherSelect,
      type: 'select',
      proxies: [mainSelect, 'DIRECT']
    },
    {
      name: autoSelect,
      type: 'url-test',
      proxies: proxies
    },...auto
  ]

  params["proxy-groups"] = proxyGroups
}

function initRules(params) {

  let baseUrl = githubProxyUrl + "Loyalsoldier/clash-rules/release/";
  let ruleProvidersKeys = [
    'reject',
    'icloud',
    'apple',
    // 'google',
    'proxy',
    'direct',
    'private',
    // 'gfw', proxy 包含 gfw
    'tld-not-cn',
    'telegramcidr',
    'cncidr',
    'lancidr',
    'applications']

  let ruleProviders = {}
  ruleProvidersKeys.forEach(e => {
    ruleProviders[e] = {
      type: "http",
      behavior: "domain",
      url: baseUrl + `${e}.txt`,
      path: `./ruleset/${e}.yaml`,
      interval: 86400
    }
  })

  let rules = [
    "RULE-SET,applications,DIRECT",
    "DOMAIN,clash.razord.top,DIRECT",
    "DOMAIN,yacd.haishan.me,DIRECT",
    "RULE-SET,private,DIRECT",
    "RULE-SET,reject,REJECT",  // 广告域名列表
    "RULE-SET,icloud,DIRECT",
    "RULE-SET,apple,DIRECT",
    // "RULE-SET,google," + mainSelect,  Google 在中国大陆可直连的域名列表
    "RULE-SET,direct,DIRECT",
    "RULE-SET,lancidr,DIRECT",
    "RULE-SET,cncidr,DIRECT",
    "RULE-SET,telegramcidr," + mainSelect,
    "RULE-SET,proxy," + mainSelect,
    "GEOIP,LAN,DIRECT",
    "GEOIP,CN,DIRECT",
    "MATCH,"+otherSelect
  ]

  params["rule-providers"] = ruleProviders
  params["rules"] = rules

}

function initDns(params){
  params["dns"] = {
    "enable": true,
    "ipv6": false,
    "listen":"0.0.0.0:1053",
    "default-nameserver": [
        "223.5.5.5",
        "119.29.29.29",
        "114.114.114.114"
    ],
    "enhanced-mode": "fake-ip",
    "fake-ip-range": "28.0.0.1/8",
    "use-hosts": true,
    "nameserver": [
        "tls://223.5.5.5:853",
        "tls://223.6.6.6:853",
        "https://doh.pub/dns-query",
        "https://dns.alidns.com/dns-query"
    ],
    "fallback": [
        "https://doh.dns.sb/dns-query",
        "https://dns.cloudflare.com/dns-query",
        "https://dns.twnic.tw/dns-query",
        "tls://8.8.4.4:853"
    ],
    "fallback-filter": {
        "geoip": true,
        "ipcidr": [
            "240.0.0.0/4",
            "0.0.0.0/32"
        ]
    }
}
}

function delParams(params){ 
  delete params["cfw-conn-break-strategy"]
  delete params["experimental"]
  delete params["hosts"]
  delete params["cfw-latency-timeout"]
  delete params["cfw-latency-url"]
  delete params["clash-for-android"]
  delete params["udp"]


}




function microsoftRules(params) {

  let baseUrl = githubProxyUrl + "blackmatrix7/ios_rule_script/master/rule/Clash/";
  let microsoftProviders = {
    'microsoft': {
      type: "http",
      behavior: "classical",
      url: baseUrl + "Microsoft/Microsoft.yaml",
      path: `./ruleset/microsoft.yaml`,
      interval: 86400
    },
    "bing": {
      type: "http",
      behavior: "classical",
      url: baseUrl + "Bing/Bing.yaml",
      path: `./ruleset/bing.yaml`,
      interval: 86400
    },
    "oneDrive": {
      type: "http",
      behavior: "classical",
      url: baseUrl + "OneDrive/OneDrive.yaml",
      path: `./ruleset/oneDrive.yaml`,
      interval: 86400
    },
  }

  let microsoftRules = [
    "RULE-SET,microsoft,Microsoft",
    "RULE-SET,bing,Microsoft",
    "RULE-SET,oneDrive,Microsoft"
  ]
  let microsoftGroup = {
    name: 'Microsoft',
    type: 'select',
    proxies: [ mainSelect,"DIRECT"]
  }

  params["rule-providers"] = { ...microsoftProviders, ...params["rule-providers"] }
  params["rules"] = [...microsoftRules, ...params["rules"]]
  params["proxy-groups"] = [...params["proxy-groups"], microsoftGroup]

}


function myRules(params) {

  let rules = [
    "DOMAIN-SUFFIX,x.com," + mainSelect
  ]
  
  params["rules"] = [...rules, ...params["rules"]]
}
