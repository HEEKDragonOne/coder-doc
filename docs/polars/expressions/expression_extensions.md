## 表达式扩展

表达式扩展功能, 能够编写一个可以扩展为多个不同表达式的表达式，具体怎么扩展取决于使用表达式的上下文的模式。

::: tip 遐想

(x+y+z) * m = (x * m) + (y * m) + (z * m)

:::


## 数据准备

```python title="Python"
df = pl.DataFrame(
    {  # As of 14th October 2024, ~3pm UTC
        "ticker": ["AAPL", "NVDA", "MSFT", "GOOG", "AMZN"],
        "company_name": ["Apple", "NVIDIA", "Microsoft", "Alphabet (Google)", "Amazon"],
        "price": [229.9, 138.93, 420.56, 166.41, 188.4],
        "day_high": [231.31, 139.6, 424.04, 167.62, 189.83],
        "day_low": [228.6, 136.3, 417.52, 164.78, 188.44],
        "year_high": [237.23, 140.76, 468.35, 193.31, 201.2],
        "year_low": [164.08, 39.23, 324.39, 121.46, 118.35],
    }
)

print(df)
```

```text
shape: (5, 7)
┌────────┬───────────────────┬────────┬──────────┬─────────┬───────────┬──────────┐
│ ticker ┆ company_name      ┆ price  ┆ day_high ┆ day_low ┆ year_high ┆ year_low │
│ ---    ┆ ---               ┆ ---    ┆ ---      ┆ ---     ┆ ---       ┆ ---      │
│ str    ┆ str               ┆ f64    ┆ f64      ┆ f64     ┆ f64       ┆ f64      │
╞════════╪═══════════════════╪════════╪══════════╪═════════╪═══════════╪══════════╡
│ AAPL   ┆ Apple             ┆ 229.9  ┆ 231.31   ┆ 228.6   ┆ 237.23    ┆ 164.08   │
│ NVDA   ┆ NVIDIA            ┆ 138.93 ┆ 139.6    ┆ 136.3   ┆ 140.76    ┆ 39.23    │
│ MSFT   ┆ Microsoft         ┆ 420.56 ┆ 424.04   ┆ 417.52  ┆ 468.35    ┆ 324.39   │
│ GOOG   ┆ Alphabet (Google) ┆ 166.41 ┆ 167.62   ┆ 164.78  ┆ 193.31    ┆ 121.46   │
│ AMZN   ┆ Amazon            ┆ 188.4  ┆ 189.83   ┆ 188.44  ┆ 201.2     ┆ 118.35   │
└────────┴───────────────────┴────────┴──────────┴─────────┴───────────┴──────────┘
```


## 选择列

- `col`函数用来引用 `DataFrame` 中的一列。

### 常规取列用法

对数值类型的列都进行除法操作：

```python title="Python"
eur_usd_rate = 1.09

newdf = df.select(
    pl.col("price") / eur_usd_rate,
    pl.col("day_high") / eur_usd_rate,
    pl.col("day_low") / eur_usd_rate,
    pl.col("year_high") / eur_usd_rate,
    pl.col("year_low") / eur_usd_rate
)

print(newdf)
```
```text
shape: (5, 5)
┌────────────┬────────────┬────────────┬────────────┬────────────┐
│ price      ┆ day_high   ┆ day_low    ┆ year_high  ┆ year_low   │
│ ---        ┆ ---        ┆ ---        ┆ ---        ┆ ---        │
│ f64        ┆ f64        ┆ f64        ┆ f64        ┆ f64        │
╞════════════╪════════════╪════════════╪════════════╪════════════╡
│ 210.917431 ┆ 212.211009 ┆ 209.724771 ┆ 217.642202 ┆ 150.53211  │
│ 127.458716 ┆ 128.073394 ┆ 125.045872 ┆ 129.137615 ┆ 35.990826  │
│ 385.834862 ┆ 389.027523 ┆ 383.045872 ┆ 429.678899 ┆ 297.605505 │
│ 152.669725 ┆ 153.779817 ┆ 151.174312 ┆ 177.348624 ┆ 111.431193 │
│ 172.844037 ┆ 174.155963 ┆ 172.880734 ┆ 184.587156 ┆ 108.577982 │
└────────────┴────────────┴────────────┴────────────┴────────────┘
```

上面常规的用法中，可以很明显的看出对于同一个处理逻辑，需要写很多次`col`函数，显得很冗余，所以可以使用 `col`函数提供的扩展功能。


### 按列名选择
向 `col` 函数提供多个列名时, 会发生最简单的表达式扩展形式。

```python title="Python"
eur_usd_rate = 1.09

result = df.with_columns(
    (
            pl.col(
                "price",
                "day_high",
                "day_low",
                "year_high",
                "year_low",
            )
            / eur_usd_rate
    ).round(2)
)
print(result)
```

```text
shape: (5, 7)
┌────────┬───────────────────┬────────┬──────────┬─────────┬───────────┬──────────┐
│ ticker ┆ company_name      ┆ price  ┆ day_high ┆ day_low ┆ year_high ┆ year_low │
│ ---    ┆ ---               ┆ ---    ┆ ---      ┆ ---     ┆ ---       ┆ ---      │
│ str    ┆ str               ┆ f64    ┆ f64      ┆ f64     ┆ f64       ┆ f64      │
╞════════╪═══════════════════╪════════╪══════════╪═════════╪═══════════╪══════════╡
│ AAPL   ┆ Apple             ┆ 210.92 ┆ 212.21   ┆ 209.72  ┆ 217.64    ┆ 150.53   │
│ NVDA   ┆ NVIDIA            ┆ 127.46 ┆ 128.07   ┆ 125.05  ┆ 129.14    ┆ 35.99    │
│ MSFT   ┆ Microsoft         ┆ 385.83 ┆ 389.03   ┆ 383.05  ┆ 429.68    ┆ 297.61   │
│ GOOG   ┆ Alphabet (Google) ┆ 152.67 ┆ 153.78   ┆ 151.17  ┆ 177.35    ┆ 111.43   │
│ AMZN   ┆ Amazon            ┆ 172.84 ┆ 174.16   ┆ 172.88  ┆ 184.59    ┆ 108.58   │
└────────┴───────────────────┴────────┴──────────┴─────────┴───────────┴──────────┘
```

上面的语句等价与：
```python title="Python"
exprs = [
    (pl.col("price") / eur_usd_rate).round(2),
    (pl.col("day_high") / eur_usd_rate).round(2),
    (pl.col("day_low") / eur_usd_rate).round(2),
    (pl.col("year_high") / eur_usd_rate).round(2),
    (pl.col("year_low") / eur_usd_rate).round(2),
]

result2 = df.with_columns(exprs)

print(result.equals(result2))
```
```text
True
```

本质就是把`col`函数扩展成了多个列名, 然后对每个列名进行相同的操作, 生成新的列。


### 按数据类型选择

在上例中，必须输入五个列名，但该函数 `col` 也可以方便地接受`一种`或`多种`数据类型。如果提供的是数据类型而不是列名，则表达式将扩展为与提供的数据类型之一匹配的所有列。上面的示例也可以写成：

```python title="Python"
eur_usd_rate = 1.09

result = df.with_columns(
    (
            pl.col(
                "price",
                "day_high",
                "day_low",
                "year_high",
                "year_low",
            )
            / eur_usd_rate
    ).round(2)
)

result2 = df.with_columns((pl.col(pl.Float64) / eur_usd_rate).round(2))
print(result.equals(result2))
print(result2)
```
```text
True
shape: (5, 7)
┌────────┬───────────────────┬────────┬──────────┬─────────┬───────────┬──────────┐
│ ticker ┆ company_name      ┆ price  ┆ day_high ┆ day_low ┆ year_high ┆ year_low │
│ ---    ┆ ---               ┆ ---    ┆ ---      ┆ ---     ┆ ---       ┆ ---      │
│ str    ┆ str               ┆ f64    ┆ f64      ┆ f64     ┆ f64       ┆ f64      │
╞════════╪═══════════════════╪════════╪══════════╪═════════╪═══════════╪══════════╡
│ AAPL   ┆ Apple             ┆ 210.92 ┆ 212.21   ┆ 209.72  ┆ 217.64    ┆ 150.53   │
│ NVDA   ┆ NVIDIA            ┆ 127.46 ┆ 128.07   ┆ 125.05  ┆ 129.14    ┆ 35.99    │
│ MSFT   ┆ Microsoft         ┆ 385.83 ┆ 389.03   ┆ 383.05  ┆ 429.68    ┆ 297.61   │
│ GOOG   ┆ Alphabet (Google) ┆ 152.67 ┆ 153.78   ┆ 151.17  ┆ 177.35    ┆ 111.43   │
│ AMZN   ┆ Amazon            ┆ 172.84 ┆ 174.16   ┆ 172.88  ┆ 184.59    ┆ 108.58   │
└────────┴───────────────────┴────────┴──────────┴─────────┴───────────┴──────────┘
```

甚至如果无法确定列的类型是Float64还是Float32时，可以同时指定两种数据类型：
```python title="Python"
result2 = df.with_columns(
    (
        pl.col(
            pl.Float32,
            pl.Float64,
        )
        / eur_usd_rate
    ).round(2)
)
print(result.equals(result2))
```
```text
True
```

:::danger 警告

`col` 函数可以接受任意数量的字符串或者任意数量的数据类型，但同一个函数中不能 `同时` 出现两者。如下错误示例：

```python title="Python"
result = df.with_columns(
    (
            pl.col(
                "price",
                "day_high",
                pl.Float64
            )
            / eur_usd_rate
    ).round(2)
)
```

:::



### 通过正则匹配选择

可以使用正则表达式来指定用于匹配的列名。为了区分常规列名和通过模式匹配扩展的列名， 正则表达式以`^`开头, 以`$`结尾。
- `与数据类型扩展不同的是，正则表达式可以与常规列名混合使用`。

```python title="Python"
eur_usd_rate = 1.09

result = df.with_columns(
    (
            pl.col("^.*_high$", "^.*_low$")
            / eur_usd_rate
    ).round(2)
)

print(result)
```
```text
shape: (5, 7)
┌────────┬───────────────────┬────────┬──────────┬─────────┬───────────┬──────────┐
│ ticker ┆ company_name      ┆ price  ┆ day_high ┆ day_low ┆ year_high ┆ year_low │
│ ---    ┆ ---               ┆ ---    ┆ ---      ┆ ---     ┆ ---       ┆ ---      │
│ str    ┆ str               ┆ f64    ┆ f64      ┆ f64     ┆ f64       ┆ f64      │
╞════════╪═══════════════════╪════════╪══════════╪═════════╪═══════════╪══════════╡
│ AAPL   ┆ Apple             ┆ 229.9  ┆ 212.21   ┆ 209.72  ┆ 217.64    ┆ 150.53   │
│ NVDA   ┆ NVIDIA            ┆ 138.93 ┆ 128.07   ┆ 125.05  ┆ 129.14    ┆ 35.99    │
│ MSFT   ┆ Microsoft         ┆ 420.56 ┆ 389.03   ┆ 383.05  ┆ 429.68    ┆ 297.61   │
│ GOOG   ┆ Alphabet (Google) ┆ 166.41 ┆ 153.78   ┆ 151.17  ┆ 177.35    ┆ 111.43   │
│ AMZN   ┆ Amazon            ┆ 188.4  ┆ 174.16   ┆ 172.88  ┆ 184.59    ┆ 108.58   │
└────────┴───────────────────┴────────┴──────────┴─────────┴───────────┴──────────┘
```

同时存在列名和正则表达式时：
```python title="Python"
result = df.select(pl.col("ticker", "^.*_high$", "^.*_low$"))
print(result)
```
```text
shape: (5, 5)
┌────────┬──────────┬─────────┬───────────┬──────────┐
│ ticker ┆ day_high ┆ day_low ┆ year_high ┆ year_low │
│ ---    ┆ ---      ┆ ---     ┆ ---       ┆ ---      │
│ str    ┆ f64      ┆ f64     ┆ f64       ┆ f64      │
╞════════╪══════════╪═════════╪═══════════╪══════════╡
│ AAPL   ┆ 231.31   ┆ 228.6   ┆ 237.23    ┆ 164.08   │
│ NVDA   ┆ 139.6    ┆ 136.3   ┆ 140.76    ┆ 39.23    │
│ MSFT   ┆ 424.04   ┆ 417.52  ┆ 468.35    ┆ 324.39   │
│ GOOG   ┆ 167.62   ┆ 164.78  ┆ 193.31    ┆ 121.46   │
│ AMZN   ┆ 189.83   ┆ 188.44  ┆ 201.2     ┆ 118.35   │
└────────┴──────────┴─────────┴───────────┴──────────┘
```







## 选择所有列

Polars 提供该函数 `all` 作为简写符号来引用所有列：

```python
result = df.select(pl.all())
print(result.equals(df))
print(result)
```
```text
True
shape: (5, 7)
┌────────┬───────────────────┬────────┬──────────┬─────────┬───────────┬──────────┐
│ ticker ┆ company_name      ┆ price  ┆ day_high ┆ day_low ┆ year_high ┆ year_low │
│ ---    ┆ ---               ┆ ---    ┆ ---      ┆ ---     ┆ ---       ┆ ---      │
│ str    ┆ str               ┆ f64    ┆ f64      ┆ f64     ┆ f64       ┆ f64      │
╞════════╪═══════════════════╪════════╪══════════╪═════════╪═══════════╪══════════╡
│ AAPL   ┆ Apple             ┆ 229.9  ┆ 231.31   ┆ 228.6   ┆ 237.23    ┆ 164.08   │
│ NVDA   ┆ NVIDIA            ┆ 138.93 ┆ 139.6    ┆ 136.3   ┆ 140.76    ┆ 39.23    │
│ MSFT   ┆ Microsoft         ┆ 420.56 ┆ 424.04   ┆ 417.52  ┆ 468.35    ┆ 324.39   │
│ GOOG   ┆ Alphabet (Google) ┆ 166.41 ┆ 167.62   ┆ 164.78  ┆ 193.31    ┆ 121.46   │
│ AMZN   ┆ Amazon            ┆ 188.4  ┆ 189.83   ┆ 188.44  ┆ 201.2     ┆ 118.35   │
└────────┴───────────────────┴────────┴──────────┴─────────┴───────────┴──────────┘
```

::: tip

函数 `pl.all` 是 `pl.col("*")` 的语法糖，但由于参数 "*" 是特例并且all更加见其知意，因此更推荐使用 `pl.all`。

:::




## 排除列

Polars 还提供了一种从表达式扩展中排除某些列的机制。可以使用函数`exclude`来指定排除的列，该函数和`col`函数接受一样的参数类型：指定列名、指定列数据类型、正则匹配。


### 按列名排除


```python title="Python"
result = df.select(
    pl.all().exclude("day_high","year_high")
)
print(result)

```

```text
shape: (5, 5)
┌────────┬───────────────────┬────────┬─────────┬──────────┐
│ ticker ┆ company_name      ┆ price  ┆ day_low ┆ year_low │
│ ---    ┆ ---               ┆ ---    ┆ ---     ┆ ---      │
│ str    ┆ str               ┆ f64    ┆ f64     ┆ f64      │
╞════════╪═══════════════════╪════════╪═════════╪══════════╡
│ AAPL   ┆ Apple             ┆ 229.9  ┆ 228.6   ┆ 164.08   │
│ NVDA   ┆ NVIDIA            ┆ 138.93 ┆ 136.3   ┆ 39.23    │
│ MSFT   ┆ Microsoft         ┆ 420.56 ┆ 417.52  ┆ 324.39   │
│ GOOG   ┆ Alphabet (Google) ┆ 166.41 ┆ 164.78  ┆ 121.46   │
│ AMZN   ┆ Amazon            ┆ 188.4  ┆ 188.44  ┆ 118.35   │
└────────┴───────────────────┴────────┴─────────┴──────────┘
```

### 按数据类型排除

```python title="Python"
result = df.select(
    pl.all().exclude(pl.Float64)
)
print(result)
```

```text
shape: (5, 2)
┌────────┬───────────────────┐
│ ticker ┆ company_name      │
│ ---    ┆ ---               │
│ str    ┆ str               │
╞════════╪═══════════════════╡
│ AAPL   ┆ Apple             │
│ NVDA   ┆ NVIDIA            │
│ MSFT   ┆ Microsoft         │
│ GOOG   ┆ Alphabet (Google) │
│ AMZN   ┆ Amazon            │
└────────┴───────────────────┘
```


### 按正则匹配排除

```python title="Python"
result = df.select(
    pl.all().exclude("^.*high$","^.*low$")
)
print(result)
```

```text
shape: (5, 3)
┌────────┬───────────────────┬────────┐
│ ticker ┆ company_name      ┆ price  │
│ ---    ┆ ---               ┆ ---    │
│ str    ┆ str               ┆ f64    │
╞════════╪═══════════════════╪════════╡
│ AAPL   ┆ Apple             ┆ 229.9  │
│ NVDA   ┆ NVIDIA            ┆ 138.93 │
│ MSFT   ┆ Microsoft         ┆ 420.56 │
│ GOOG   ┆ Alphabet (Google) ┆ 166.41 │
│ AMZN   ┆ Amazon            ┆ 188.4  │
└────────┴───────────────────┴────────┘
```


### 其他示例

```python title="Python"
result = df.select(pl.col(pl.Float64).exclude("^day_.*$"))
print(result)
```

```text
shape: (5, 3)
┌────────┬───────────┬──────────┐
│ price  ┆ year_high ┆ year_low │
│ ---    ┆ ---       ┆ ---      │
│ f64    ┆ f64       ┆ f64      │
╞════════╪═══════════╪══════════╡
│ 229.9  ┆ 237.23    ┆ 164.08   │
│ 138.93 ┆ 140.76    ┆ 39.23    │
│ 420.56 ┆ 468.35    ┆ 324.39   │
│ 166.41 ┆ 193.31    ┆ 121.46   │
│ 188.4  ┆ 201.2     ┆ 118.35   │
└────────┴───────────┴──────────┘
```




## 列重命名

默认情况下，将表达式应用于列时，结果将与原始列保持相同的名称。保留列名在语义上可能是错误的，在某些情况下，如果出现重复的名称，Polars 甚至可能会引发错误，如下示例：

```python title="Python" {5,6}
eur_usd_rate = 1.09
gbp_usd_rate = 1.31

result = df.select(
    pl.col("price") / gbp_usd_rate,  # This would be named "price"...
    pl.col("price") / eur_usd_rate,  # And so would this.
)

print(result)
```
运行上述代码将会报错。为了防止此类错误，允许用户在适当的时候重命名新生成的列，Polars 提供了一系列功能，可更改列或一组列的名称。


### 重命名单列

函数`alias`已在之前的文档中出现过很多次，它允许重命名`新生成`的单列，但`alias`不可用于表达式扩展，因为它是专门设计用于重命名单个列的。示例：

```python title="Python"
eur_usd_rate = 1.09
gbp_usd_rate = 1.31

result = df.select(
    pl.col("price"),
    (pl.col("price") / gbp_usd_rate).alias("price (GBP)"),
    (pl.col("price") / eur_usd_rate).alias("price (EUR)"),
)

print(result)
```

```text
shape: (5, 3)
┌────────┬─────────────┬─────────────┐
│ price  ┆ price (GBP) ┆ price (EUR) │
│ ---    ┆ ---         ┆ ---         │
│ f64    ┆ f64         ┆ f64         │
╞════════╪═════════════╪═════════════╡
│ 229.9  ┆ 175.496183  ┆ 210.917431  │
│ 138.93 ┆ 106.053435  ┆ 127.458716  │
│ 420.56 ┆ 321.038168  ┆ 385.834862  │
│ 166.41 ┆ 127.030534  ┆ 152.669725  │
│ 188.4  ┆ 143.816794  ┆ 172.844037  │
└────────┴─────────────┴─────────────┘
```

### 为列名添加前后缀

当只需为现有名称添加静态前缀或静态后缀时，可以使用命名空间`name`中的函数`prefix`和`suffix`来为列名添加前缀和后缀。


```python title="Python"
eur_usd_rate = 1.09
gbp_usd_rate = 1.31

result = df.select(
    (pl.col("^year_.*$") / eur_usd_rate).name.prefix("in_eur_"),
    (pl.col("day_high", "day_low") / gbp_usd_rate).name.suffix("_gbp"),
)

print(result)
```

```text
shape: (5, 4)
┌──────────────────┬─────────────────┬──────────────┬─────────────┐
│ in_eur_year_high ┆ in_eur_year_low ┆ day_high_gbp ┆ day_low_gbp │
│ ---              ┆ ---             ┆ ---          ┆ ---         │
│ f64              ┆ f64             ┆ f64          ┆ f64         │
╞══════════════════╪═════════════════╪══════════════╪═════════════╡
│ 217.642202       ┆ 150.53211       ┆ 176.572519   ┆ 174.503817  │
│ 129.137615       ┆ 35.990826       ┆ 106.564885   ┆ 104.045802  │
│ 429.678899       ┆ 297.605505      ┆ 323.694656   ┆ 318.717557  │
│ 177.348624       ┆ 111.431193      ┆ 127.954198   ┆ 125.78626   │
│ 184.587156       ┆ 108.577982      ┆ 144.908397   ┆ 143.847328  │
└──────────────────┴─────────────────┴──────────────┴─────────────┘
```

### 列名转换

如果以上都不能满足需求, 命名空间`name`还提供了`map`方法, 该方法接收一个`函数`, 该`函数`接受旧的列名返回新的列名。

```python title="Python"
result = df.select(pl.all().name.map(str.upper))
result2 = df.select(pl.all().name.map(lambda it: it.upper()))
print(result.equals(result2))
print(result)
```
```text
True
shape: (5, 7)
┌────────┬───────────────────┬────────┬──────────┬─────────┬───────────┬──────────┐
│ TICKER ┆ COMPANY_NAME      ┆ PRICE  ┆ DAY_HIGH ┆ DAY_LOW ┆ YEAR_HIGH ┆ YEAR_LOW │
│ ---    ┆ ---               ┆ ---    ┆ ---      ┆ ---     ┆ ---       ┆ ---      │
│ str    ┆ str               ┆ f64    ┆ f64      ┆ f64     ┆ f64       ┆ f64      │
╞════════╪═══════════════════╪════════╪══════════╪═════════╪═══════════╪══════════╡
│ AAPL   ┆ Apple             ┆ 229.9  ┆ 231.31   ┆ 228.6   ┆ 237.23    ┆ 164.08   │
│ NVDA   ┆ NVIDIA            ┆ 138.93 ┆ 139.6    ┆ 136.3   ┆ 140.76    ┆ 39.23    │
│ MSFT   ┆ Microsoft         ┆ 420.56 ┆ 424.04   ┆ 417.52  ┆ 468.35    ┆ 324.39   │
│ GOOG   ┆ Alphabet (Google) ┆ 166.41 ┆ 167.62   ┆ 164.78  ┆ 193.31    ┆ 121.46   │
│ AMZN   ┆ Amazon            ┆ 188.4  ┆ 189.83   ┆ 188.44  ┆ 201.2     ┆ 118.35   │
└────────┴───────────────────┴────────┴──────────┴─────────┴───────────┴──────────┘
```
还可以使用自定义函数进行列名的转换, 例如：
```python title="Python"
def new_name_example(old_name: str) -> str:
    return old_name + "_" + old_name

result = df.select(pl.all().name.map(new_name_example))
print(result)
```
```text
shape: (5, 7)
┌──────────────┬─────────────┬─────────────┬─────────────┬─────────────┬─────────────┬─────────────┐
│ ticker_ticke ┆ company_nam ┆ price_price ┆ day_high_da ┆ day_low_day ┆ year_high_y ┆ year_low_ye │
│ r            ┆ e_company_n ┆ ---         ┆ y_high      ┆ _low        ┆ ear_high    ┆ ar_low      │
│ ---          ┆ ame         ┆ f64         ┆ ---         ┆ ---         ┆ ---         ┆ ---         │
│ str          ┆ ---         ┆             ┆ f64         ┆ f64         ┆ f64         ┆ f64         │
│              ┆ str         ┆             ┆             ┆             ┆             ┆             │
╞══════════════╪═════════════╪═════════════╪═════════════╪═════════════╪═════════════╪═════════════╡
│ AAPL         ┆ Apple       ┆ 229.9       ┆ 231.31      ┆ 228.6       ┆ 237.23      ┆ 164.08      │
│ NVDA         ┆ NVIDIA      ┆ 138.93      ┆ 139.6       ┆ 136.3       ┆ 140.76      ┆ 39.23       │
│ MSFT         ┆ Microsoft   ┆ 420.56      ┆ 424.04      ┆ 417.52      ┆ 468.35      ┆ 324.39      │
│ GOOG         ┆ Alphabet    ┆ 166.41      ┆ 167.62      ┆ 164.78      ┆ 193.31      ┆ 121.46      │
│              ┆ (Google)    ┆             ┆             ┆             ┆             ┆             │
│ AMZN         ┆ Amazon      ┆ 188.4       ┆ 189.83      ┆ 188.44      ┆ 201.2       ┆ 118.35      │
└──────────────┴─────────────┴─────────────┴─────────────┴─────────────┴─────────────┴─────────────┘
```



## 动态生成表达式

表达式扩展是一个非常有用的功能，但它并不能解决所有问题。如果需求稍微有些复杂,表达式扩展就显得有些力不从心了。例如，如果想计算每日和每年价格的高低差值，表达式扩展就没有办法，但可以使用动态生成表达式的方式来实现自己的需求。基于该需求，首先看看使用正常的方式如何实现：

```python title="Python"
result1 = df.with_columns(
    (pl.col("day_high") - pl.col("day_low")).alias("day_amplitude"),
    (pl.col("year_high") - pl.col("year_low")).alias("year_amplitude")
)

print(result1)
```
```text
shape: (5, 9)
┌────────┬───────────────────┬────────┬──────────┬───┬──────────┬───────────────┬────────────────┐
│ ticker ┆ company_name      ┆ price  ┆ day_high ┆ … ┆ year_low ┆ day_amplitude ┆ year_amplitude │
│ ---    ┆ ---               ┆ ---    ┆ ---      ┆   ┆ ---      ┆ ---           ┆ ---            │
│ str    ┆ str               ┆ f64    ┆ f64      ┆   ┆ f64      ┆ f64           ┆ f64            │
╞════════╪═══════════════════╪════════╪══════════╪═══╪══════════╪═══════════════╪════════════════╡
│ AAPL   ┆ Apple             ┆ 229.9  ┆ 231.31   ┆ … ┆ 164.08   ┆ 2.71          ┆ 73.15          │
│ NVDA   ┆ NVIDIA            ┆ 138.93 ┆ 139.6    ┆ … ┆ 39.23    ┆ 3.3           ┆ 101.53         │
│ MSFT   ┆ Microsoft         ┆ 420.56 ┆ 424.04   ┆ … ┆ 324.39   ┆ 6.52          ┆ 143.96         │
│ GOOG   ┆ Alphabet (Google) ┆ 166.41 ┆ 167.62   ┆ … ┆ 121.46   ┆ 2.84          ┆ 71.85          │
│ AMZN   ┆ Amazon            ┆ 188.4  ┆ 189.83   ┆ … ┆ 118.35   ┆ 1.39          ┆ 82.85          │
└────────┴───────────────────┴────────┴──────────┴───┴──────────┴───────────────┴────────────────┘
```
然后可能还会想到使用`for`循环的方式来实现：
```python title="Python" {1,3}
result2 = df
for tp in ["day", "year"]:
    result2 = result2.with_columns(
        (pl.col(f"{tp}_high") - pl.col(f"{tp}_low")).alias(f"{tp}_amplitude")
    )
print(result2)
```
::: tip
注意高亮的两行代码的作用！弄懂为什么要这么写！
:::

```text
shape: (5, 9)
┌────────┬───────────────────┬────────┬──────────┬───┬──────────┬───────────────┬────────────────┐
│ ticker ┆ company_name      ┆ price  ┆ day_high ┆ … ┆ year_low ┆ day_amplitude ┆ year_amplitude │
│ ---    ┆ ---               ┆ ---    ┆ ---      ┆   ┆ ---      ┆ ---           ┆ ---            │
│ str    ┆ str               ┆ f64    ┆ f64      ┆   ┆ f64      ┆ f64           ┆ f64            │
╞════════╪═══════════════════╪════════╪══════════╪═══╪══════════╪═══════════════╪════════════════╡
│ AAPL   ┆ Apple             ┆ 229.9  ┆ 231.31   ┆ … ┆ 164.08   ┆ 2.71          ┆ 73.15          │
│ NVDA   ┆ NVIDIA            ┆ 138.93 ┆ 139.6    ┆ … ┆ 39.23    ┆ 3.3           ┆ 101.53         │
│ MSFT   ┆ Microsoft         ┆ 420.56 ┆ 424.04   ┆ … ┆ 324.39   ┆ 6.52          ┆ 143.96         │
│ GOOG   ┆ Alphabet (Google) ┆ 166.41 ┆ 167.62   ┆ … ┆ 121.46   ┆ 2.84          ┆ 71.85          │
│ AMZN   ┆ Amazon            ┆ 188.4  ┆ 189.83   ┆ … ┆ 118.35   ┆ 1.39          ┆ 82.85          │
└────────┴───────────────────┴────────┴──────────┴───┴──────────┴───────────────┴────────────────┘
```
两者最后产生的结果是一样的：
```python title="Python"
print(result1.equals(result2))
```
```text
True
```

::: tip 高亮代码含义

在用`for`循环实现效果时，在循环外面一个赋值语句，也许有人没明白为什么为要这么写，可能想的是下面这样：
```python title="Python" {3}
# result2 = df
for tp in ["day", "year"]:
    result2 = df.with_columns(
        (pl.col(f"{tp}_high") - pl.col(f"{tp}_low")).alias(f"{tp}_amplitude")
    )
```
但是当你把结果 `result2`打印出来时，你会发现结果并不是和之前的一样，而是`少了一列`。对比后会发现少的是`day_amplitude`列，这是因为在循环中，`result2`被重新赋值了，所以`day_amplitude`列就消失了，只有最后一个`year`的计算值。而为什么上面示例中可以实现，核心就在于高亮的两行代码。

:::

上面的示例中，使用`for`循环的方式，虽然实现了需求，但是不推荐这么使用。而更推荐使用下面这种方式：
```python title="Python"
def amplitude_expressions(time_periods):
    for tp in time_periods:
        yield (pl.col(f"{tp}_high") - pl.col(f"{tp}_low")).alias(f"{tp}_amplitude")

result3 = df.with_columns(amplitude_expressions(["day", "year"]))
print(result3)
```
```text
shape: (5, 9)
┌────────┬───────────────────┬────────┬──────────┬───┬──────────┬───────────────┬────────────────┐
│ ticker ┆ company_name      ┆ price  ┆ day_high ┆ … ┆ year_low ┆ day_amplitude ┆ year_amplitude │
│ ---    ┆ ---               ┆ ---    ┆ ---      ┆   ┆ ---      ┆ ---           ┆ ---            │
│ str    ┆ str               ┆ f64    ┆ f64      ┆   ┆ f64      ┆ f64           ┆ f64            │
╞════════╪═══════════════════╪════════╪══════════╪═══╪══════════╪═══════════════╪════════════════╡
│ AAPL   ┆ Apple             ┆ 229.9  ┆ 231.31   ┆ … ┆ 164.08   ┆ 2.71          ┆ 73.15          │
│ NVDA   ┆ NVIDIA            ┆ 138.93 ┆ 139.6    ┆ … ┆ 39.23    ┆ 3.3           ┆ 101.53         │
│ MSFT   ┆ Microsoft         ┆ 420.56 ┆ 424.04   ┆ … ┆ 324.39   ┆ 6.52          ┆ 143.96         │
│ GOOG   ┆ Alphabet (Google) ┆ 166.41 ┆ 167.62   ┆ … ┆ 121.46   ┆ 2.84          ┆ 71.85          │
│ AMZN   ┆ Amazon            ┆ 188.4  ┆ 189.83   ┆ … ┆ 118.35   ┆ 1.39          ┆ 82.85          │
└────────┴───────────────────┴────────┴──────────┴───┴──────────┴───────────────┴────────────────┘
```

这样做的好处是，通过循环生成计算表达式，然后在上下文中使用一次即可；而不是在循环中生成计算表达式然后再在上下文中进行使用。而且这样写，Polars能够更好的优化查询以及并行进行计算。

:::tip 遐想

循环中一个一个查询基金信息；循环外一次性查询出所有基金信息。

:::




## 更多列选择方式

`Polars`附带子模块, `selectors`子模块提供了许多函数, 允许编写更灵活的列选择表达式。

通过`selectors`来实现使用`string()`函数和`ends_with()`函数选择所有字符串列或者以"_high"结尾的列。

```python title="Python"
import polars.selectors as cs

result = df.select(cs.string() | cs.ends_with("_high"))
print(result)
```

```text
shape: (5, 4)
┌────────┬───────────────────┬──────────┬───────────┐
│ ticker ┆ company_name      ┆ day_high ┆ year_high │
│ ---    ┆ ---               ┆ ---      ┆ ---       │
│ str    ┆ str               ┆ f64      ┆ f64       │
╞════════╪═══════════════════╪══════════╪═══════════╡
│ AAPL   ┆ Apple             ┆ 231.31   ┆ 237.23    │
│ NVDA   ┆ NVIDIA            ┆ 139.6    ┆ 140.76    │
│ MSFT   ┆ Microsoft         ┆ 424.04   ┆ 468.35    │
│ GOOG   ┆ Alphabet (Google) ┆ 167.62   ┆ 193.31    │
│ AMZN   ┆ Amazon            ┆ 189.83   ┆ 201.2     │
└────────┴───────────────────┴──────────┴───────────┘
```

使用`numeric()`函数选择所有的数值列, 无论是整数还是浮点数：
```python title="Python"
import polars.selectors as cs

result = df.select(cs.numeric())
print(result)
```
```text
shape: (5, 5)
┌────────┬──────────┬─────────┬───────────┬──────────┐
│ price  ┆ day_high ┆ day_low ┆ year_high ┆ year_low │
│ ---    ┆ ---      ┆ ---     ┆ ---       ┆ ---      │
│ f64    ┆ f64      ┆ f64     ┆ f64       ┆ f64      │
╞════════╪══════════╪═════════╪═══════════╪══════════╡
│ 229.9  ┆ 231.31   ┆ 228.6   ┆ 237.23    ┆ 164.08   │
│ 138.93 ┆ 139.6    ┆ 136.3   ┆ 140.76    ┆ 39.23    │
│ 420.56 ┆ 424.04   ┆ 417.52  ┆ 468.35    ┆ 324.39   │
│ 166.41 ┆ 167.62   ┆ 164.78  ┆ 193.31    ┆ 121.46   │
│ 188.4  ┆ 189.83   ┆ 188.44  ┆ 201.2     ┆ 118.35   │
└────────┴──────────┴─────────┴───────────┴──────────┘
```

### 选择器与数学集合操作

|  操作   | 解释  |
|  :----:  | :----:  |
| A \| B  | 并集 |
| A & B  | 交集 |
| A - B  | 差集, 在A中不在B中 |
|  ~A   | 补集, 不在A中 |


匹配名称中包含下划线的所有非字符串列：


```python title="Python"
result = df.select(cs.contains("_") - cs.string())
print(result)
```
```text
shape: (5, 4)
┌──────────┬─────────┬───────────┬──────────┐
│ day_high ┆ day_low ┆ year_high ┆ year_low │
│ ---      ┆ ---     ┆ ---       ┆ ---      │
│ f64      ┆ f64     ┆ f64       ┆ f64      │
╞══════════╪═════════╪═══════════╪══════════╡
│ 231.31   ┆ 228.6   ┆ 237.23    ┆ 164.08   │
│ 139.6    ┆ 136.3   ┆ 140.76    ┆ 39.23    │
│ 424.04   ┆ 417.52  ┆ 468.35    ┆ 324.39   │
│ 167.62   ┆ 164.78  ┆ 193.31    ┆ 121.46   │
│ 189.83   ┆ 188.44  ┆ 201.2     ┆ 118.35   │
└──────────┴─────────┴───────────┴──────────┘
```

匹配非数值列：

```python title="Python"
result = df.select(~cs.numeric())
print(result)
```
```text
shape: (5, 2)
┌────────┬───────────────────┐
│ ticker ┆ company_name      │
│ ---    ┆ ---               │
│ str    ┆ str               │
╞════════╪═══════════════════╡
│ AAPL   ┆ Apple             │
│ NVDA   ┆ NVIDIA            │
│ MSFT   ┆ Microsoft         │
│ GOOG   ┆ Alphabet (Google) │
│ AMZN   ┆ Amazon            │
└────────┴───────────────────┘
```



### 解决运算符歧义

`~`符号针对布尔表达式含义是取反, 针对选择器是取补集。当在使用选择器，然后又想要在表达式上下文中使用充当选择器的集合运算符的运算符之一时，可以使用函数`as_expr`解决歧义。例如，想把所有以`"has_"`开头的列的值取反。

```python {13}
people = pl.DataFrame(
    {
        "name": ["Anna", "Bob"],
        "has_partner": [True, False],
        "has_kids": [False, False],
        "has_tattoos": [True, False],
        "is_alive": [True, True],
    }
)

wrong_result = people.select((~cs.starts_with("has_")).name.prefix("not_"))
print(wrong_result)
```
```text
shape: (2, 2)
┌──────────┬──────────────┐
│ not_name ┆ not_is_alive │
│ ---      ┆ ---          │
│ str      ┆ bool         │
╞══════════╪══════════════╡
│ Anna     ┆ true         │
│ Bob      ┆ true         │
└──────────┴──────────────┘
```

结果并不是我们想要的, 而是取出了所有不以`"has_"`开头的列，这就存在歧义。为了实现取反, 我们需要使用`as_expr()`方法：

```python title="Python"
result = people.select((~cs.starts_with("has_").as_expr()).name.prefix("not_"))
print(result)
```
```text
shape: (2, 3)
┌─────────────────┬──────────────┬─────────────────┐
│ not_has_partner ┆ not_has_kids ┆ not_has_tattoos │
│ ---             ┆ ---          ┆ ---             │
│ bool            ┆ bool         ┆ bool            │
╞═════════════════╪══════════════╪═════════════════╡
│ false           ┆ true         ┆ false           │
│ true            ┆ true         ┆ true            │
└─────────────────┴──────────────┴─────────────────┘
```




正确的写法是使用`as_expr()`方法, `as_expr`方法将选择器转换为表达式, 然后取反, 我们看下面代码

```python
res = people.select((~cs.starts_with("has_").as_expr()))
print(res)
```
可以细致对比一下结果, 是否按照我们的预期, 针对布尔值进行取反了
```text
shape: (2, 3)
┌─────────────┬──────────┬─────────────┐
│ has_partner ┆ has_kids ┆ has_tattoos │
│ ---         ┆ ---      ┆ ---         │
│ bool        ┆ bool     ┆ bool        │
╞═════════════╪══════════╪═════════════╡
│ false       ┆ true     ┆ false       │
│ true        ┆ true     ┆ true        │
└─────────────┴──────────┴─────────────┘
```

### 调试选择器

当不确定是否有一个Polars选择器时, 可以使用函数`cs.is_selector`来判断：

```python title="Python"
print(cs.is_selector(~cs.starts_with("has_")))
print(cs.is_selector(~cs.starts_with("has_").as_expr()))
```
```text
True
False
```
这可以帮助避免任何模棱两可的情况，即认为正在使用表达式进行操作，但实际上是使用选择器进行操作。另一个有用的调试器函数是 `expand_selector`, 对于给定的目标`DataFrame`或者选择器, 可以检查给定选择器将扩展为哪些列：

```python title="Python"
import polars.selectors as cs

people = pl.DataFrame(
    {
        "name": ["Anna", "Bob"],
        "has_partner": [True, False],
        "has_kids": [False, False],
        "has_tattoos": [True, False],
        "is_alive": [True, True],
    }
)

print(
    cs.expand_selector(
        people,
        cs.starts_with("has_"),
    )
)
```
```text
('has_partner', 'has_kids', 'has_tattoos')
```


### 更多

子模块`selectors`的常见用法：
```python title="Python"
people = pl.DataFrame(
    {
        "name": ["Anna", "Bob"],
        "age": [12, 21],
        "weight": [42.3, 63.3],
        "height": [161.3, 170.9],
        "6month": [True, False],
        "1year": [True, False],
        "135": [True, False],
        "has_partner": [True, False],
        "has_kids": [False, False],
        "has_tattoos": [True, False],
        "is_alive": [True, True],
    }
)

print("======= boolean")
print(people.select(cs.boolean()))
print("======= float")
print(people.select(cs.float()))
print("======= integer")
print(people.select(cs.integer()))
print("======= numeric")
print(people.select(cs.numeric()))
print("======= string")
print(people.select(cs.string()))
print("======= alphanumeric")
print(people.select(cs.alphanumeric()))
print("======= by_name")
print(people.select(cs.by_name("age")))
print("======= contains")
print(people.select(cs.contains("h")))
print("======= digit")
print(people.select(cs.digit()))
```

```text
======= boolean
shape: (2, 7)
┌────────┬───────┬───────┬─────────────┬──────────┬─────────────┬──────────┐
│ 6month ┆ 1year ┆ 135   ┆ has_partner ┆ has_kids ┆ has_tattoos ┆ is_alive │
│ ---    ┆ ---   ┆ ---   ┆ ---         ┆ ---      ┆ ---         ┆ ---      │
│ bool   ┆ bool  ┆ bool  ┆ bool        ┆ bool     ┆ bool        ┆ bool     │
╞════════╪═══════╪═══════╪═════════════╪══════════╪═════════════╪══════════╡
│ true   ┆ true  ┆ true  ┆ true        ┆ false    ┆ true        ┆ true     │
│ false  ┆ false ┆ false ┆ false       ┆ false    ┆ false       ┆ true     │
└────────┴───────┴───────┴─────────────┴──────────┴─────────────┴──────────┘
======= float
shape: (2, 2)
┌────────┬────────┐
│ weight ┆ height │
│ ---    ┆ ---    │
│ f64    ┆ f64    │
╞════════╪════════╡
│ 42.3   ┆ 161.3  │
│ 63.3   ┆ 170.9  │
└────────┴────────┘
======= integer
shape: (2, 1)
┌─────┐
│ age │
│ --- │
│ i64 │
╞═════╡
│ 12  │
│ 21  │
└─────┘
======= numeric
shape: (2, 3)
┌─────┬────────┬────────┐
│ age ┆ weight ┆ height │
│ --- ┆ ---    ┆ ---    │
│ i64 ┆ f64    ┆ f64    │
╞═════╪════════╪════════╡
│ 12  ┆ 42.3   ┆ 161.3  │
│ 21  ┆ 63.3   ┆ 170.9  │
└─────┴────────┴────────┘
======= string
shape: (2, 1)
┌──────┐
│ name │
│ ---  │
│ str  │
╞══════╡
│ Anna │
│ Bob  │
└──────┘
======= alphanumeric
shape: (2, 7)
┌──────┬─────┬────────┬────────┬────────┬───────┬───────┐
│ name ┆ age ┆ weight ┆ height ┆ 6month ┆ 1year ┆ 135   │
│ ---  ┆ --- ┆ ---    ┆ ---    ┆ ---    ┆ ---   ┆ ---   │
│ str  ┆ i64 ┆ f64    ┆ f64    ┆ bool   ┆ bool  ┆ bool  │
╞══════╪═════╪════════╪════════╪════════╪═══════╪═══════╡
│ Anna ┆ 12  ┆ 42.3   ┆ 161.3  ┆ true   ┆ true  ┆ true  │
│ Bob  ┆ 21  ┆ 63.3   ┆ 170.9  ┆ false  ┆ false ┆ false │
└──────┴─────┴────────┴────────┴────────┴───────┴───────┘
======= by_name
shape: (2, 1)
┌─────┐
│ age │
│ --- │
│ i64 │
╞═════╡
│ 12  │
│ 21  │
└─────┘
======= contains
shape: (2, 6)
┌────────┬────────┬────────┬─────────────┬──────────┬─────────────┐
│ weight ┆ height ┆ 6month ┆ has_partner ┆ has_kids ┆ has_tattoos │
│ ---    ┆ ---    ┆ ---    ┆ ---         ┆ ---      ┆ ---         │
│ f64    ┆ f64    ┆ bool   ┆ bool        ┆ bool     ┆ bool        │
╞════════╪════════╪════════╪═════════════╪══════════╪═════════════╡
│ 42.3   ┆ 161.3  ┆ true   ┆ true        ┆ false    ┆ true        │
│ 63.3   ┆ 170.9  ┆ false  ┆ false       ┆ false    ┆ false       │
└────────┴────────┴────────┴─────────────┴──────────┴─────────────┘
======= digit
shape: (2, 1)
┌───────┐
│ 135   │
│ ---   │
│ bool  │
╞═══════╡
│ true  │
│ false │
└───────┘
```

::: tip

关于子模块`selectors`的更多用法, 请参阅 [详见官方文档](https://docs.pola.rs/user-guide/expressions/expression-expansion/#complete-reference)

:::
