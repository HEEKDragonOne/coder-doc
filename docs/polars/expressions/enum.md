## 枚举

枚举，就是用来记录那些只能取有限个可能值的数据，比如：性别、单位（如时间、距离等）、操作系统等等。Polars提供了两种：`Enum` 和 `Categorical`，本章节只关注`Enum`，若对 `Categorical` 感兴趣的可以到[官网进行查看](https://docs.pola.rs/user-guide/expressions/categorical-data-and-enums/)。


## 创建使用`Enum`

使用`Enum`时必须提前指定类型，如下所示：

```python title="Python"
bears_enum = pl.Enum(["Polar", "Panda", "Brown"]) # 定义一个枚举类型
bears = pl.Series(["Polar", "Panda", "Brown", "Brown", "Polar"], dtype=bears_enum) # 创建一个序列，元素类型为枚举类型
print(bears)
```
```text
shape: (5,)
Series: '' [enum]
[
	"Polar"
	"Panda"
	"Brown"
	"Brown"
	"Polar"
]
```

枚举同样可以使用用于`DataFrame`：
```python title="Python"
log_levels = pl.Enum(["debug", "info", "warning", "error"])

logs = pl.DataFrame(
    {
        "level": ["debug", "info", "debug", "error"],
        "message": [
            "process id: 525",
            "Service started correctly",
            "startup time: 67ms",
            "Cannot connect to DB!",
        ],
    },
    schema_overrides={
        "level": log_levels,
    },
)
print(logs)
```
```text
shape: (4, 2)
┌───────┬───────────────────────────┐
│ level ┆ message                   │
│ ---   ┆ ---                       │
│ enum  ┆ str                       │
╞═══════╪═══════════════════════════╡
│ debug ┆ process id: 525           │
│ info  ┆ Service started correctly │
│ debug ┆ startup time: 67ms        │
│ error ┆ Cannot connect to DB!     │
└───────┴───────────────────────────┘
```



## 无效值

如果已经指定了某列的数据类型为`Enum`，那么当列中的数据存在值不在`Enum`中时， 就会报错。如下示例：

```python title="Python" {2,7}
bears_enum = pl.Enum(["Polar", "Panda", "Brown"])
bears = pl.Series(["Polar", "Panda", "Brown", "Brown", "Polar","dms"], dtype=bears_enum)

log_levels = pl.Enum(["debug", "info", "warning", "error"])
logs = pl.DataFrame(
    {
        "level": ["debug", "info", "debug", "error", "dms"],
        "message": [
            "process id: 525",
            "Service started correctly",
            "startup time: 67ms",
            "Cannot connect to DB!",
        ],
    },
    schema_overrides={
        "level": log_levels,
    },
)
```
上述两个示例，都会报如下类似的错误：
```text
polars.exceptions.InvalidOperationError: conversion from `str` to `enum` failed in column '' for 1 out of 6 values: ["dms"]
```


## 类别排序和比较

`Enum`是有序的， 其顺序由初始化时的先后顺序决定。如下示例：

```python title="Python"
log_levels = pl.Enum(["debug", "info", "warning", "error"]) # debug < info < warning < error

logs = pl.DataFrame(
    {
        "level": ["debug", "info", "debug", "error"],
        "message": [
            "process id: 525",
            "Service started correctly",
            "startup time: 67ms",
            "Cannot connect to DB!",
        ],
    },
    schema_overrides={
        "level": log_levels,
    },
)

non_debug_logs = logs.filter(
    pl.col("level") > "info",
)
print(non_debug_logs)
```

```text
shape: (1, 2)
┌───────┬───────────────────────┐
│ level ┆ message               │
│ ---   ┆ ---                   │
│ enum  ┆ str                   │
╞═══════╪═══════════════════════╡
│ error ┆ Cannot connect to DB! │
└───────┴───────────────────────┘
```


```python title="Python"
log_levels = pl.Enum(["debug", "info", "warning", "error"])

logs2 = pl.DataFrame(
    {
        "level": ["debug", "info", "debug", "error"],
        "message": [
            "process id: 525",
            "Service started correctly",
            "startup time: 67ms",
            "Cannot connect to DB!",
        ],
    },
    schema_overrides={
        "level": log_levels,
    },
)

non_debug_logs = logs2.filter(
    pl.col("level") < "info",
)
print(non_debug_logs)
```
```text
shape: (2, 2)
┌───────┬────────────────────┐
│ level ┆ message            │
│ ---   ┆ ---                │
│ enum  ┆ str                │
╞═══════╪════════════════════╡
│ debug ┆ process id: 525    │
│ debug ┆ startup time: 67ms │
└───────┴────────────────────┘
```
