import { LitElement, html } from 'lit-element'

const modulesLoading = []

class FragLitElement extends LitElement {
    onLoaded (buildDir, children) {
        for (const child in children) {
            childInfo = children[child]
            modulesLoading.push(
                import(buildDir + child.file).then(module => {
                    if (module.children) {
                        module.onLoaded(buildDir, child.children)
                    } else {
                        return ''
                    }
                })
            )
        }
    }
}

export * from 'lit-element'
export { FragLitElement }
