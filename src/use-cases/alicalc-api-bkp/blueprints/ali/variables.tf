variable "USECASE" {
  type = string
  default = "alicalc"
}

variable "region" {
  type = string
  default= "cn-hongkong"
# Zone ID = Zone
# ap-northeast-1 = Tokyo
# ap-northeast-2 = Seoul
# ap-south-1     = Mumbai
# ap-southeast-1 = Singapore
# ap-southeast-2 = Sydney
# ap-southeast-3 = Kuala Lumpur
# ap-southeast-5 = Jakarta
# ap-southeast-6 = Manila
# ap-southeast-7 = Bangkok
# cn-beijing     = China (Beijing)
# cn-chengdu     = China (Chengdu)
# cn-hangzhou    = China (Hangzhou)
# cn-hangzhou    = China (Hohhot)
# cn-hohhot      = China (Heyuan)
# cn-hongkong    = China (Hong Kong)
# cn-qingdao     = China (Qingdao)
# cn-shanghai    = China (Shanghai)
# cn-shenzhen    = China (Shenzhen)
# cn-zhangjiakou = China (Zhangjiakou)
# eu-central-1   = Frankfurt
# eu-west-1      = London
# me-east-1      = Dubai
# us-east-1      = Virginia
# us-west-1      = Silicon Valley
}

variable "short_name" {
  default = "ali"
}

variable "memory" {
  type = number
  default = 128
}

variable "funcget" {
    type = string
    default = "../../faas/ali/get/get.zip"
}

variable "funcname" {
  default = "alicloudfc"
}

variable "ALICLOUD_ACCESS_KEY" {
  type = string
}

variable "ALICLOUD_SECRET_KEY" {
  type = string
}