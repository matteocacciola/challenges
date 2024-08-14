const pooledDownload = async (connect, save, downloadList, maxConcurrency) => {
  // create a pool of connect, returning an error message if any of them fails
  const pool = []
  try {
    for (let i = 0; i < maxConcurrency; i++) {
      pool.push(await connect())
    }
  } catch (error) {
    // raise an exception if first connection fails
    if (pool.length === 0) {
      throw {
        message: "connection failed",
      }
    }
  }

  let err = null

  // download the files from downloadList, using the pool of connect and distributing the work evenly between them
  for (let i = 0; i < downloadList.length; i++) {
    try {
      const { download } = pool[i % pool.length]
      const result = await download(downloadList[i])
      await save(result)
    } catch (error) {
      err = error
    }
  }

  for (const item of pool) {
    const { close } = await item
    await close()
  }

  if (err) {
    throw err
  }
}

module.exports = pooledDownload
