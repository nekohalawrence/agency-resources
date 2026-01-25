const rules = [
 //让程序(XXX.exe)不通过VPN 'PROCESS-NAME,vivaldi.exe,DIRECT', //V浏览器---经测试成功！
 'PROCESS-NAME,WeChat.exe,DIRECT', //微信---没有测试！ //让任何来自以下路径的进程不通过VPN，经测试失败！
 'PROCESS-PATH,C:\Program Files\Vivaldi\*,DIRECT', //V浏览器---经测试失败！ //让网址(含google关键字)不通过VPN
 'DOMAIN-KEYWORD,google,DIRECT', //---经测试成功！ //让网址(以google.com结尾)不通过VPN
 'DOMAIN-SUFFIX,google.com,DIRECT', //---经测试成功！]
function main(config) { //在数组末尾追加原本的配置
 rules.push(...config['rules']) //覆盖配置
 config['rules'] = rules return config;
}
