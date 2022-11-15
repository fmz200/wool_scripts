## QuanX 小白配置图文教程：

>**注意：请先认真阅读本节文字**
> 
> 本教程所使用内容均收集于热心网友分享，原作者请联系我署名，感谢！
> 
>首次配置可能需要梯子或者节点，请根据图片步骤一步一步来，如果因为节点的网络问题导致不成功，多试几次！多试几次！多试几次！ 遇到问题请先自己试着解决。
> 
>去广告由于网络原因，配置原因并非100%有效，但对主流软件基本都支持。还有部分软件本身毒瘤，可能去不掉。多数软件能去即可，不要钻牛角尖！
> 
>有时候功能不完善可能是因为软件版本问题或者开发者没有维护导致。

>**粘贴链接的时候如果报错，请检查一下：**
>>1、链接不能有多余的空格
>>
>>2、报错90%的原因是网络原因，需要自行更换延迟较低的节点，再重新试试。还不行的话，关掉软件，重新试
>>
>>3、认真仔细看图片点的是哪里

## 配置开始
### 1、前往配置文件仓库复制全局配置文件raw路径备用，俗称`小白配置/懒人配置`，此处以[@Orz-3大佬](https://raw.githubusercontent.com/Orz-3/QuantumultX/master/Orz-3.conf)的库为例。
>**关于配置文件和脚本都在本地/自己手机里的情况，大同小异，我们有时间再说**

![img.png](../pic/quanX/how-to-use-00.png)

![img_1.png](../pic/quanX/how-to-use-00-01.png)

![img_2.png](../pic/quanX/how-to-use-00-02.png)

### 2、Quan X主界面，点击右下角风车，然后弹出界面下拉至 配置文件 - 下载，点击下载，将上一步复制的地址粘贴到弹出窗口，然后点确定

![img.png](../pic/quanX/how-to-use-01.png)![img.png](../pic/quanX/how-to-use-02.png)![img.png](../pic/quanX/how-to-use-03.png)

### 3、上一步点击保存后往上滑，找到 **MitM** ，点击生成证书，继续点击配置证书，根据提示安装证书
>你已经看到下面的图片中已经打开了分流，重写和MitM，这是因为已经配置好了，做演示用没有关闭，实际上初次配置是没有打开的，需要配置好证书以后再打开

![img.png](../pic/quanX/how-to-use-04.png)![img.png](../pic/quanX/how-to-use-05.png)![img.png](../pic/quanX/how-to-use-06.png)

### 4、安装成功后启用证书，并到系统的 **设置-通用-关于本机**，点击信任证书

![img.png](../pic/quanX/how-to-use-07.png)![img.png](../pic/quanX/how-to-use-08.png)![img.png](../pic/quanX/how-to-use-09.png)

![img.png](../pic/quanX/how-to-use-10.png)![img.png](../pic/quanX/how-to-use-11.png)![img.png](../pic/quanX/how-to-use-12.png)

![img.png](../pic/quanX/img.png)![img_1.png](../pic/quanX/img_1.png)

>到这里证书已经信任以后，**分流，重写，MitM** 就可以打开了

### 5、添加节点 / 订阅，具体为在Quan X主界面点击右下角风车-节点-节点资源，然后点右上角添加，填写标签和资源路径（重要，不添加节点重写和分流可能无法更新）

>**这里只说自己买了订阅的情况，关于单个节点添加，大同小异，我们有时间再说**

![img_8.png](../pic/quanX/img_8.png)![img_9.png](../pic/quanX/img_9.png)![img_10.png](../pic/quanX/img_10.png)

![img_11.png](../pic/quanX/img_11.png)

### 6、添加重写

![img_2.png](../pic/quanX/img_2.png)![img_3.png](../pic/quanX/img_3.png)![img_4.png](../pic/quanX/img_4.png)

![img_5.png](../pic/quanX/img_5.png)![img_6.png](../pic/quanX/img_6.png)![img_7.png](../pic/quanX/img_7.png)

### 7、添加分流

>**添加分流和重写流程是一样的**
> 
![img_1.png](../pic/quanX/how-to-use-16.png)

![img_2.png](../pic/quanX/how-to-use-17.png)

![img_3.png](../pic/quanX/how-to-use-18.png)

### 8、怎么 打开 / 关闭梯子；切换分流模式

![img_4.png](../pic/quanX/how-to-use-19.png)

## 配置成功如下图所示，可以正常使用了

![img_12.png](../pic/quanX/img_12.png)