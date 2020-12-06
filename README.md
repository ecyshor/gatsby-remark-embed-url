## What it does

The plugin loads the content from an url as code.
You can specify the code language.
Github and github gists urls are treated specially.

### WARNING

As the plugin runs at build time this means that the content of the file will be static and updated only when the build runs again.

You could automate this to trigger the build when any of the embeded urls have changes but that's a project for another day.

## Configure

`yarn add gatsby-remark-embed-url`

### Add it to the plugin list

```json
{
      resolve: 'gatsby-transformer-remark',
      options: {
        plugins: [
          'gatsby-remark-embed-url'
        ]
      }
}
```

## Usage

Make sure to leave one empty line before and after the embed.

### Github

Github urls are treated specially so there's no need to use the raw content url.

```markdown

embed-url-code https://github.com/ecyshor/pi-temperature-monitor/blob/main/prometheus/prometheus.yml yaml

```

### Github gists

As gists can contain multiple files you need to specify the raw file url

```markdown

embed-url-code https://gist.githubusercontent.com/ecyshor/d97d520fbfb161a9f7c7370528ed9c87/raw/41a9c13b34433f9562b6b4a006e5a56e2a068115/temperature.json json


```

The plugin will prettify the embed url when being outputted in the html