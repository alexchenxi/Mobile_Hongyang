# 项目结构
## config
    conf.js -- 环境配置

## api 
   所有接口请求
   
## view
    case -- 案场
    selftExtension   -- 自拓
    manager -- 管理系统

# 编译打包
npm run local -- 独立部署编译运行
npm run saas:local -- saas编译运行
npm run build:prod -- 正式环境打包
npm run build:qa -- 测试环境打包

# 后台根据类别获取字典列表（commonApi.js 里 dictList方法会用到）
cognitive_channel 获取认知途径
follow_type 获取跟进方式

# 自渠、案场 角色
ZT_DIRECTOR  渠道主管
ZT_MANAGER  渠道经理
ZT_MEMBER  渠道专员
ZT_KEYMAN 关键人
ZT_BEEMAN 小蜜蜂
ST_DIRECTOR  销售主管
ST_MANAGER  销售经理
ST_SALES  置业顾问

# 登录验证码api地址修改

修改文件根目录env文件中的VUE_APP_CAPTCHA_BASE_API即可
