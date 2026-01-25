function main(content) {
  const isObject = (value) => {
    return value !== null && typeof value === 'object'
  }

  const mergeConfig = (existingConfig, newConfig) => {
    if (!isObject(existingConfig)) {
      existingConfig = {}
    }
    if (!isObject(newConfig)) {
      return existingConfig
    }
    return { ...existingConfig, ...newConfig }
  }

  const cnDnsList = [
    'https://1.12.12.12/dns-query',
    'https://223.5.5.5/dns-query',
  ]
  const trustDnsList = [
    'https://doh.apad.pro/dns-query',
    'https://1.0.0.1/dns-query',
    'https://208.67.222.222/dns-query',
  ]
  const notionDns = 'tls://dns.jerryw.cn'
  const notionUrls = [
    'http-inputs-notion.splunkcloud.com',
    '+.notion-static.com',
    '+.notion.com',
    '+.notion.new',
    '+.notion.site',
    '+.notion.so',
  ]
  const combinedUrls = notionUrls.join(',');
  const dnsOptions = {
    'enable': true,
    'prefer-h3': true, // 如果DNS服务器支持DoH3会优先使用h3
    'default-nameserver': cnDnsList, // 用于解析其他DNS服务器、和节点的域名, 必须为IP, 可为加密DNS。注意这个只用来解析节点和其他的dns，其他网络请求不归他管
    'nameserver': trustDnsList, // 其他网络请求都归他管
    
    // 这个用于覆盖上面的 nameserver
    'nameserver-policy': {
      [combinedUrls]: notionDns,
      'geosite:geolocation-!cn': trustDnsList,
      // 如果你有一些内网使用的DNS，应该定义在这里，多个域名用英文逗号分割
      // '+.公司域名.com, www.4399.com, +.baidu.com': '10.0.0.1'
    },
  }

  // GitHub加速前缀
  const githubPrefix = 'https://fastgh.lainbo.com/'

  // GEO数据GitHub资源原始下载地址
  const rawGeoxURLs = {
    geoip: 'https://github.com/MetaCubeX/meta-rules-dat/releases/download/latest/geoip-lite.dat',
    geosite: 'https://github.com/MetaCubeX/meta-rules-dat/releases/download/latest/geosite.dat',
    mmdb: 'https://github.com/MetaCubeX/meta-rules-dat/releases/download/latest/country-lite.mmdb',
  }

  // 生成带有加速前缀的GEO数据资源对象
  const accelURLs = Object.fromEntries(
    Object.entries(rawGeoxURLs).map(([key, githubUrl]) => [key, `${githubPrefix}${githubUrl}`]),
  )

  const otherOptions = {
    'unified-delay': true,
    'tcp-concurrent': true,
    'profile': {
      'store-selected': true,
      'store-fake-ip': true,
    },
    'sniffer': {
      enable: true,
      sniff: {
        TLS: {
          ports: [443, 8443],
        },
        HTTP: {
          'ports': [80, '8080-8880'],
          'override-destination': true,
        },
      },
    },
    'geodata-mode': true,
    'geo-auto-update': true,
    'geo-update-interval': 24,
    'geodata-loader': 'standard',
    'geox-url': accelURLs,
    'find-process-mode': 'strict',
  }
  content.dns = mergeConfig(content.dns, dnsOptions)
  return { ...content, ...otherOptions }
}
