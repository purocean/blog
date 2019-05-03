# 使用 reduce 一行代码解决信用卡号验证问题

## 背景
女票 JAVA 课程有一道作业题，验证信用卡号是否合法。
>实验作业longer 9月30号 星期五 12:09
实验1:验证信用卡号码
Lab Project: Validating Credit Cards
 Problem Description:
Credit card numbers follow certain patterns. A credit card number must have between 13 and 16 digits. It must start with:
4 for Visa cards
5 for Master cards
37 for American Express cards
6 for Discover cards
In 1954, Hans Luhn of IBM proposed an algorithm for validating credit card numbers. The algorithm is useful to determine if a card number is entered correctly or if a credit card is scanned correctly by a scanner. Almost all credit card numbers are generated following this validity check, commonly known as the Luhn check or the Mod 10 check, which can be described as follows (for illustration, consider the card number 4388576018402626):
1. Double every second digit from right to left. If doubling of a digit results in a two-digit number, add up the two digits to get a single-digit number.
2 * 2 = 4
2 * 2 = 4
4 * 2 = 8
1 * 2 = 2
6 * 2 = 12 (1 + 2 = 3)
5 * 2 = 10 (1 + 0 = 1)
8 * 2 = 16 (1 + 6 = 7)
4 * 2 = 8
2. Now add all single-digit numbers from Step 1. 
4 + 4 + 8 + 2 + 3 + 1 + 7 + 8 = 37
3. Add all digits in the odd places from right to left in the card number.
   6 + 6 + 0 + 8 + 0 + 7 + 8 + 3 = 38
4. Sum the results from Step 2 and Step 3.
37 + 38 = 75
5. If the result from Step 4 is divisible by 10, the card number is valid; otherwise, it is invalid. For example, the number 4388576018402626 is invalid, but the number 4388576018410707 is valid.
Write a program that prompts the user to enter a credit card number as a long integer. Display whether the number is valid or invalid.

两个测试用例
```
不合法卡号:
4388576018402626
合法卡号:
4388576018410707
```
## JAVA 实现
既然是作业，先用 JAVA 写了。我 JAVA 也不是太熟，就这样。
```
import java.util.*;

public class Validating {
    public static void main(String[] args) {
        while (!xiaomiaomiao()) {
            System.out.println("The number you input is invalid. Please try again.");
        }

        System.out.println("The number you input is valid.");
    }

    public static boolean xiaomiaomiao() {
        System.out.println("Input your card number:");
        String numStr = (new Scanner(System.in)).next();

        int count = 0;
        int sum = 0;
        for (int i = numStr.length() - 1; i >= 0; --i) {
            // 判断字符合法
            int ascii = (int) numStr.charAt(i);
            if (ascii < 48 || 57 < ascii) {
                System.out.println("Input must be numeric.");
                return false;
            }

            // 求和
            int num = ascii - 48;
            if ((numStr.length() - i) % 2 == 0) {
                int tmp = num * 2;
                sum += tmp > 9 ? tmp - 9 : tmp;
            } else {
                sum += num;
            }

            ++count;
        }

        if (count < 13 || 16 < count) {
            System.out.println("13 ~ 16.");

            return false;
        }

        return (sum % 10 == 0);
    }
}
```

## 使用 Javascript 的 reduce 实现
先上一张图
![](./FILES/shi-yong-reduce-yi-xing-dai-ma-jie-jue-xin-yong-qia-hao-yan-zheng-wen-ti.md/61d072e6.png)
很形象的描述了 Reduce 的作用是吧。
然后代码实现，一句话解决（未校验号码长度）
```
[...'4388576018410707'].reduceRight((previousValue, currentValue, index, array) => {if ((array.length-index) % 2) {return previousValue - -currentValue} else {return previousValue - -(currentValue*2 > 9 ? currentValue*2-9 : currentValue*2)} }) % 10 ? '验证失败' : '验证成功'
"验证成功"
[...'4388576018402626'].reduceRight((previousValue, currentValue, index, array) => {if ((array.length-index) % 2) {return previousValue - -currentValue} else {return previousValue - -(currentValue*2 > 9 ? currentValue*2-9 : currentValue*2)} }) % 10 ? '验证失败' : '验证成功'
"验证失败"
```

![](./FILES/shi-yong-reduce-yi-xing-dai-ma-jie-jue-xin-yong-qia-hao-yan-zheng-wen-ti.md/5959a679.png)

## 参考
1. <http://es6.ruanyifeng.com/?search=reduce&x=0&y=0#docs/destructuring>
2. <https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/reduceRight>
