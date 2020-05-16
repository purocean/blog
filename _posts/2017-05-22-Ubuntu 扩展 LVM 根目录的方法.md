---
title: Ubuntu 扩展 LVM 根目录的方法
date: 2017-05-22
author: 洋子
tags:
  - Linux
---

最近手头一台运行在 Hyper-V 下面抓数据的服务器 (Ubuntu 16.04) 磁盘空间不够了，之前也没有把数据单独放到一个分区，所以只能想办法把根目录给搞大一点。之前没有处理过这样的问题，网上搜了很多资料，现在把拓展方法记录，分享出来。
**建议在操作之前做好备份工作**

## 步骤概览
1. 调大物理磁盘
2. 确定要操作的磁盘
3. 扩展 LVM 逻辑分区所在的物理拓展分区
4. 新增 LVM 逻辑分区
5. 新分区合并到相应 Volumn Group
6. 更新文件系统

# 调大物理磁盘
虚拟机关机，然后直接在虚拟机管理里面操作。

![调整磁盘大小](./FILES/ubuntu-kuo-zhan-lvm-gen-mu-lu-de-fang-fa.md/8c9380dd.png)
现在把磁盘从 100G 调整到了 300G

## 确定要操作的磁盘
先看下磁盘使用情况，运行命令
```bash
root@vm003:~# df -h
Filesystem               Size  Used Avail Use% Mounted on
udev                     3.9G     0  3.9G   0% /dev
tmpfs                    798M  8.6M  789M   2% /run
/dev/mapper/Ubuntu-root   94G   88G  1.9G  98% /
tmpfs                    3.9G     0  3.9G   0% /dev/shm
tmpfs                    5.0M     0  5.0M   0% /run/lock
tmpfs                    3.9G     0  3.9G   0% /sys/fs/cgroup
/dev/sda1                472M  382M   66M  86% /boot
tmpfs                    100K     0  100K   0% /run/lxcfs/controllers
tmpfs                    798M     0  798M   0% /run/user/0
```
虽然我们已经把物理磁盘调整到了 300G，但是根目录还是100G的样子，已用 98%

运行命令
```bash
root@vm003:~# fdisk -l
Disk /dev/sda: 300 GiB, 322122547200 bytes, 629145600 sectors
Units: sectors of 1 * 512 = 512 bytes
Sector size (logical/physical): 512 bytes / 4096 bytes
I/O size (minimum/optimal): 4096 bytes / 4096 bytes
Disklabel type: dos
Disk identifier: 0xa88f1366

Device     Boot   Start       End   Sectors  Size Id Type
/dev/sda1  *       2048    999423    997376  487M 83 Linux
/dev/sda2       1001470 209713151 208711682 99.5G  5 Extended
/dev/sda5       1001472 209713151 208711680 99.5G 8e Linux LVM

Partition 2 does not start on physical sector boundary.


Disk /dev/mapper/Ubuntu-root: 95.5 GiB, 102563315712 bytes, 200318976 sectors
Units: sectors of 1 * 512 = 512 bytes
Sector size (logical/physical): 512 bytes / 4096 bytes
I/O size (minimum/optimal): 4096 bytes / 4096 bytes


Disk /dev/mapper/Ubuntu-swap_1: 4 GiB, 4294967296 bytes, 8388608 sectors
Units: sectors of 1 * 512 = 512 bytes
Sector size (logical/physical): 512 bytes / 4096 bytes
I/O size (minimum/optimal): 4096 bytes / 4096 bytes
```
可以看到 */dev/sda* 已经确实被调整到了300GiB，只是系统还没用到。
也知道了我们要操作 **/dev/sda**

# 扩大 LVM 逻辑分区所在的物理分区
运行命令
```bash
root@vm003:~# parted /dev/sda
GNU Parted 3.2
Using /dev/sda
Welcome to GNU Parted! Type 'help' to view a list of commands.
(parted) print # 查看分区
Model: Msft Virtual Disk (scsi)
Disk /dev/sda: 322GB
Sector size (logical/physical): 512B/4096B
Partition Table: msdos
Disk Flags:

Number  Start   End    Size   Type      File system  Flags
 1      1049kB  512MB  511MB  primary   ext2         boot
 2      513MB   107GB  107GB  extended
 5      513MB   107GB  107GB  logical                lvm

(parted) resizepart 2 # 调整 sda2 分区大小
End?  [107GB]? -0 # 直接充满
(parted) print # 再次查看
Model: Msft Virtual Disk (scsi)
Disk /dev/sda: 322GB
Sector size (logical/physical): 512B/4096B
Partition Table: msdos
Disk Flags:

Number  Start   End    Size   Type      File system  Flags
 1      1049kB  512MB  511MB  primary   ext2         boot
 2      513MB   322GB  322GB  extended
 5      513MB   107GB  107GB  logical                lvm

(parted) q # 完成退出
Information: You may need to update /etc/fstab.
```
现在我们已经把 /dev/sda2 给拓展出来了

# 新增 LVM 逻辑分区
运行命令
```bash
root@vm003:~# fdisk /dev/sda

Welcome to fdisk (util-linux 2.27.1).
Changes will remain in memory only, until you decide to write them.
Be careful before using the write command.


Command (m for help): p # 查看现在的分区情况
Disk /dev/sda: 300 GiB, 322122547200 bytes, 629145600 sectors
Units: sectors of 1 * 512 = 512 bytes
Sector size (logical/physical): 512 bytes / 4096 bytes
I/O size (minimum/optimal): 4096 bytes / 4096 bytes
Disklabel type: dos
Disk identifier: 0xa88f1366

Device     Boot   Start       End   Sectors   Size Id Type
/dev/sda1  *       2048    999423    997376   487M 83 Linux
/dev/sda2       1001470 629145599 628144130 299.5G  5 Extended
/dev/sda5       1001472 209713151 208711680  99.5G 8e Linux LVM

Partition 2 does not start on physical sector boundary.

Command (m for help): n # 新增分区，选择逻辑分区，起止点看情况输入，默认值是填充满整个磁盘

All space for primary partitions is in use.
Adding logical partition 6
First sector (209715200-629145599, default 209715200):
Last sector, +sectors or +size{K,M,G,T,P} (209715200-629145599, default 629145599):

Created a new partition 6 of type 'Linux' and of size 200 GiB.

Command (m for help): p # 查看新增的分区
Disk /dev/sda: 300 GiB, 322122547200 bytes, 629145600 sectors
Units: sectors of 1 * 512 = 512 bytes
Sector size (logical/physical): 512 bytes / 4096 bytes
I/O size (minimum/optimal): 4096 bytes / 4096 bytes
Disklabel type: dos
Disk identifier: 0xa88f1366

Device     Boot     Start       End   Sectors   Size Id Type
/dev/sda1  *         2048    999423    997376   487M 83 Linux
/dev/sda2         1001470 629145599 628144130 299.5G  5 Extended
/dev/sda5         1001472 209713151 208711680  99.5G 8e Linux LVM
/dev/sda6       209715200 629145599 419430400   200G 83 Linux

Partition 2 does not start on physical sector boundary.

Command (m for help): t # 改变分区类型为 Linux LVM
Partition number (1,2,5,6, default 6): 6 # sda6
Partition type (type L to list all types): 8e # LVM 类型的 Id 代码

Changed type of partition 'Linux' to 'Linux LVM'.

Command (m for help): p # 再次查看分区情况
Disk /dev/sda: 300 GiB, 322122547200 bytes, 629145600 sectors
Units: sectors of 1 * 512 = 512 bytes
Sector size (logical/physical): 512 bytes / 4096 bytes
I/O size (minimum/optimal): 4096 bytes / 4096 bytes
Disklabel type: dos
Disk identifier: 0xa88f1366

Device     Boot     Start       End   Sectors   Size Id Type
/dev/sda1  *         2048    999423    997376   487M 83 Linux
/dev/sda2         1001470 629145599 628144130 299.5G  5 Extended
/dev/sda5         1001472 209713151 208711680  99.5G 8e Linux LVM
/dev/sda6       209715200 629145599 419430400   200G 8e Linux LVM

Partition 2 does not start on physical sector boundary.

Command (m for help): wq # 确认没有问题，保存退出

The partition table has been altered.
Calling ioctl() to re-read partition table.
Re-reading the partition table failed.: Device or resource busy

The kernel still uses the old table. The new table will be used at the next reboot or after you run partprobe(8) or kpartx(8).
```
## 新分区合并到相应 Volumn Group
运行命令
```bash
root@vm003:~# vgdisplay
  --- Volume group ---
  VG Name               Ubuntu
  System ID
  Format                lvm2
```
可以看出我们要操作的VG Name 为 **Ubuntu**，记录下来。
接着运行命令
```bash
root@vm003:~# vgextend Ubuntu /dev/sda6 # /dev/sda6 是刚刚增加的 LVM 分区
  Device /dev/sda6 not found (or ignored by filtering).
  Unable to add physical volume '/dev/sda6' to volume group 'Ubuntu'.
```
呃，，，提示没有找到 */dev/sda6* 这个设备，还是重启一下好了。
```bash
root@vm003:~# reboot
```
重启后再次执行
```bash
root@vm003:~# vgextend Ubuntu /dev/sda6 # /dev/sda6 是刚刚增加的 LVM 分区
  Physical volume "/dev/sda6" successfully created
  Volume group "Ubuntu" successfully extended
```
再查看一下 Volumn Group 的状态，运行命令
```bash
root@vm003:~# vgs
  VG     #PV #LV #SN Attr   VSize   VFree
  Ubuntu   2   2   0 wz--n- 299.52g 200.00g
```
确实加进去了。
然后运行
```bash
root@vm003:~# lvdisplay
  --- Logical volume ---
  LV Path                /dev/Ubuntu/root
  LV Name                root
  VG Name                Ubuntu
```
我们知道了 *Ubuntu* VG 的 LV Path 是 **/dev/Ubuntu/root**，记录下来。
然后运行
```bash
root@vm003:~# lvresize -l +100%FREE /dev/Ubuntu/root # /dev/Ubuntu/root 是 LV Path
  Size of logical volume Ubuntu/root changed from 95.52 GiB (24453 extents) to 295.52 GiB (75652 extents).
  Logical volume root successfully resized.
```
这就成功啦。
>警告： 如果操作时出现下面这样的 warning，就说明现在 logic volumn 的总大小还不对，resize 不但不增加空间，反而在缩小空间，如果继续操作下去，必将丢失数据。应立即停止！按 n 取消。

>WARNING: Reducing active and open logical volume to 32.00 MiB
  THIS MAY DESTROY YOUR DATA (filesystem etc.)
Do you really want to reduce root? [y/n]*

## 更新文件系统
最后一步，运行命令
```bash
root@vm003:~# resize2fs -p /dev/mapper/Ubuntu-root # /dev/mapper/Ubuntu-root 是从 df 命令看到的文件系统信息
resize2fs 1.42.13 (17-May-2015)
Filesystem at /dev/mapper/Ubuntu-root is mounted on /; on-line resizing required
old_desc_blocks = 6, new_desc_blocks = 19

The filesystem on /dev/mapper/Ubuntu-root is now 77467648 (4k) blocks long.
```
这个过程可能会花几分钟时间，耐心等待就好了。
然后运行 df 命令查看磁盘使用
```bash
root@vm003:~# df -h
Filesystem               Size  Used Avail Use% Mounted on
udev                     3.9G     0  3.9G   0% /dev
tmpfs                    798M  8.6M  789M   2% /run
/dev/mapper/Ubuntu-root  291G   88G  191G  32% /
tmpfs                    3.9G     0  3.9G   0% /dev/shm
tmpfs                    5.0M     0  5.0M   0% /run/lock
tmpfs                    3.9G     0  3.9G   0% /sys/fs/cgroup
/dev/sda1                472M  382M   66M  86% /boot
tmpfs                    100K     0  100K   0% /run/lxcfs/controllers
tmpfs                    798M     0  798M   0% /run/user/0
```
大功告成！

## 参考
<http://luqitao.github.io/2015/12/08/Resize-Image-Rootpartition/>
