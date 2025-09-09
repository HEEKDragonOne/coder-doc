## 类型强制转换

强制类型转换会将[列的底层数据类型](../concepts/data_types_and_structures.md)转换为新的数据类型。通过`cast`函数实现，该函数包含一个参数`strict`, 用于确定Polars在遇到无法从源数据类型转换为目标数据类型的值时的行为。默认为`strict=True`, 这意味着 Polars 将抛出一个错误，通知用户转换失败，同时提供无法转换的值的详细信息。如果 `strict=False`，则任何无法转换为目标数据类型的值都将被静默转换为null。

:::tip 

- 简单总结就是：默认情况下进行不同类型间的强制转换，如果存在无法强转的情况就会直接报错（例如字符串转数字时，字符串中包含字母）。但是Polars提供了一个`strict`参数，它的本质作用就是遇到无法强转的情况时，是否直接进行报错，如果不报错，那么就会将那些不能强转的值置为null。

- 另外还需要注意一个点：在向下转换时，特别需要注意是否会存在溢出的情况！

- 在向下转换，在一定程度上可以减少内存占用。

:::


## 基本示例

### 数据准备

```python title="Python"
df = pl.DataFrame(
    {
        "integers": [1, 2, 3],
        "big_integers": [10000002, 2, 30000003],
        "floats": [4.0, 5.8, -6.3],
    }
)

print(df)
```

```text
shape: (3, 3)
┌──────────┬──────────────┬────────┐
│ integers ┆ big_integers ┆ floats │
│ ---      ┆ ---          ┆ ---    │
│ i64      ┆ i64          ┆ f64    │
╞══════════╪══════════════╪════════╡
│ 1        ┆ 10000002     ┆ 4.0    │
│ 2        ┆ 2            ┆ 5.8    │
│ 3        ┆ 30000003     ┆ -6.3   │
└──────────┴──────────────┴────────┘
```

### 类型转换


下面代码将i64类型的数据转换为f32， 将f64转换为i32， 需要注意浮点数转换为整数时丢失精度：

```python title="Python"
result = df.select(
    pl.col("integers").cast(pl.Float32).alias("integers_as_floats"),
    pl.col("floats").cast(pl.Int32).alias("floats_as_integers"),
)
print(result)
```

```text
shape: (3, 2)
┌────────────────────┬────────────────────┐
│ integers_as_floats ┆ floats_as_integers │
│ ---                ┆ ---                │
│ f32                ┆ i32                │
╞════════════════════╪════════════════════╡
│ 1.0                ┆ 4                  │
│ 2.0                ┆ 5                  │
│ 3.0                ┆ -6                 │
└────────────────────┴────────────────────┘
```


## 向下转换

可以通过更改与数值数据类型关联的精度来减少列的内存占用。以下代码演示了如何使用从`Int64`到`Int16`和从`Float64`到`Float32`的转换来降低内存使用量：


```python title="Python"
print(f"Before downcasting: {df.estimated_size()} bytes")
result = df.with_columns(
    pl.col("integers").cast(pl.Int16),
    pl.col("floats").cast(pl.Float32),
)
print(f"After downcasting: {result.estimated_size()} bytes")
```

```text
Before downcasting: 72 bytes
After downcasting: 42 bytes
```


## 字符串与数字互转

表示数字的字符串可以通过强制类型转换转换为相应的数据类型。反向转换也是可行的：

```python title="Python"
df = pl.DataFrame(
    {
        "integers_as_strings": ["1", "2", "3"],
        "floats_as_strings": ["4.0", "5.8", "-6.3"],
        "floats": [4.0, 5.8, -6.3],
    }
)

result = df.select(
    pl.col("integers_as_strings").cast(pl.Int32),
    pl.col("floats_as_strings").cast(pl.Float64),
    pl.col("floats").cast(pl.String),
)
print(result)
```
```text
shape: (3, 3)
┌─────────────────────┬───────────────────┬────────┐
│ integers_as_strings ┆ floats_as_strings ┆ floats │
│ ---                 ┆ ---               ┆ ---    │
│ i32                 ┆ f64               ┆ str    │
╞═════════════════════╪═══════════════════╪════════╡
│ 1                   ┆ 4.0               ┆ 4.0    │
│ 2                   ┆ 5.8               ┆ 5.8    │
│ 3                   ┆ -6.3              ┆ -6.3   │
└─────────────────────┴───────────────────┴────────┘
```
如果列包含非数字值或者格式错误, Polars会抛出错误并给出详细的错误信息, 可以设置`strict=False`绕过错误获取null值。

```python titile="Python"
df = pl.DataFrame(
    {
        "integers_as_strings": ["1", "2i", "3"],
        "floats_as_strings": ["4.0", "5.8f", "-6.3"],
        "floats": [4.0, 5.8, -6.3],
    }
)

result = df.select(
    pl.col("integers_as_strings").cast(pl.Int32, strict=False),
    pl.col("floats_as_strings").cast(pl.Float64, strict=False),
    pl.col("floats").cast(pl.String),
)
print(result)
```
```text {8}
shape: (3, 3)
┌─────────────────────┬───────────────────┬────────┐
│ integers_as_strings ┆ floats_as_strings ┆ floats │
│ ---                 ┆ ---               ┆ ---    │
│ i32                 ┆ f64               ┆ str    │
╞═════════════════════╪═══════════════════╪════════╡
│ 1                   ┆ 4.0               ┆ 4.0    │
│ null                ┆ null              ┆ 5.8    │
│ 3                   ┆ -6.3              ┆ -6.3   │
└─────────────────────┴───────────────────┴────────┘
```


## 布尔类型转换

- 数值转换为布尔类型时, 0转换为false, 非0转换为true
- 布尔转换为数值类型时, true转换为1, false转换为0


```python title="Python"
df = pl.DataFrame(
    {
        "integers": [-1, 0, 2, 3, 4],
        "floats": [0.0, 1.0, 2.0, 3.0, 4.0],
        "bools": [True, False, True, False, True],
    }
)

result = df.select(
    pl.col("integers").cast(pl.Boolean),
    pl.col("floats").cast(pl.Boolean),
    pl.col("bools").cast(pl.Int8),
)
print(result)
```
```text
shape: (5, 3)
┌──────────┬────────┬───────┐
│ integers ┆ floats ┆ bools │
│ ---      ┆ ---    ┆ ---   │
│ bool     ┆ bool   ┆ i8    │
╞══════════╪════════╪═══════╡
│ true     ┆ false  ┆ 1     │
│ false    ┆ true   ┆ 0     │
│ true     ┆ true   ┆ 1     │
│ true     ┆ true   ┆ 0     │
│ true     ┆ true   ┆ 1     │
└──────────┴────────┴───────┘
```



## 日期类型处理

所有日期数据类型的数据在内部都表示为: 从参考时间(纪元)到现在所经过的时间单位数， Unix纪元: `1970 年 1 月 1 日 00:00:00 UTC`。

- `Date`: 存储自纪元以来的天数
- `Datetime`: 存储自纪元以来的毫秒数(`ms`)
- `Time`: 时间单位是纳秒(`ns`)

```python title="Python"
from datetime import date, datetime, time

print(date(1970,1,1))
print(datetime(1970,1,1,0,0,0))
print(time(0,0,1))
```
```text
1970-01-01
1970-01-01 00:00:00
00:00:01
```

Polars允许在数字类型和日期数据类型之间进行转换：

### 日期转为数字

```python title="Python"
from datetime import date, datetime, time

df = pl.DataFrame(
    {
        "date": [
            date(1970, 1, 1),  # epoch
            date(1970, 1, 10),  # 9 days later
        ],
        "datetime": [
            datetime(1970, 1, 1, 0, 0, 0),  # epoch
            datetime(1970, 1, 1, 0, 1, 0),  # 1 minute later
        ],
        "time": [
            time(0, 0, 0),  # reference time
            time(0, 0, 1),  # 1 second later
        ],
    }
)

result = df.select(
    pl.col("date").cast(pl.Int64).alias("days_since_epoch"),
    pl.col("datetime").cast(pl.Int64).alias("us_since_epoch"),
    pl.col("time").cast(pl.Int64).alias("ns_since_midnight"),
)
print(result)
```

```text
shape: (2, 3)
┌──────────────────┬────────────────┬───────────────────┐
│ days_since_epoch ┆ us_since_epoch ┆ ns_since_midnight │
│ ---              ┆ ---            ┆ ---               │
│ i64              ┆ i64            ┆ i64               │
╞══════════════════╪════════════════╪═══════════════════╡
│ 0                ┆ 0              ┆ 0                 │
│ 9                ┆ 60000000       ┆ 1000000000        │
└──────────────────┴────────────────┴───────────────────┘
```

### 日期类型和字符串互转
- 日期类型转换为字符串: `.dt.to_string()`
- 字符串转换为日期类型: `.str.to_datetime()`


```python title="Python"
from datetime import date

df = pl.DataFrame(
    {
        "date": [date(2022, 1, 1), date(2022, 1, 2)],
        "string": ["2023-01-01", "2023-01-02"],
    }
)

result = df.select(
    pl.col("date").dt.to_string("%Y-%m-%d"),
    pl.col("string").str.to_datetime("%Y-%m-%d"),
)
print(result)
```
```text
shape: (2, 2)
┌────────────┬─────────────────────┐
│ date       ┆ string              │
│ ---        ┆ ---                 │
│ str        ┆ datetime[μs]        │
╞════════════╪═════════════════════╡
│ 2022-01-01 ┆ 2023-01-01 00:00:00 │
│ 2022-01-02 ┆ 2023-01-02 00:00:00 │
└────────────┴─────────────────────┘
```

:::tip

`str.to_datetime`具有支持时区功能的其他选项, 更多信息可以参考官方[API文档](https://docs.pola.rs/api/python/stable/reference/expressions/api/polars.Expr.str.to_datetime.html#polars.Expr.str.to_datetime)

:::