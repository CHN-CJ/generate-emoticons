import { Component, createEffect, createSignal, onMount } from 'solid-js'
import { For, Switch, Match, Show } from 'solid-js'
import SelectButton from './components/SelectButton'

type SvgImageModule = typeof import('*.svg')
// ImportModuleFunction ==> () => Promise<import('*.svg')>
type ImportModuleFunction = () => Promise<SvgImageModule>

const pathToImage = (path: string) => {
    return new Promise<HTMLImageElement | null>(resolve => {
        if (path === '') {
            resolve(null)
            return
        }
        const image = new Image(400, 400)
        image.onload = (e) => {
            console.log('loaded', path + " " + JSON.stringify(image))
            resolve(image)
        }
        image.src = path
    })
}

/*
    const modules = import.meta.glob('./dir/*.js')
    以上将会被转译为下面的样子：
    // vite 生成的代码
    const modules = {
    './dir/foo.js': () => import('./dir/foo.js'),
    './dir/bar.js': () => import('./dir/bar.js'),
    }
    你可以遍历 modules 对象的 key 值来访问相应的模块：
    for (const path in modules) {
    modules[path]().then((mod) => {
        console.log(path, mod)
    })
    }
*/

const resolveImportGlobModule = async (modules: Record<string, ImportModuleFunction>) => {
    console.log('modules', modules)
    const imports = Object.values(modules).map(importFn => importFn())
    console.log('imports', imports)
    const loadedModules = await Promise.all(imports)
    return loadedModules.map(module => module.default)
}

type EmojiSlice = 'head' | 'eyes' | 'eyebrows' | 'mouth' | 'detail'
const tabs: EmojiSlice[] = ['head', 'eyes', 'eyebrows', 'mouth', 'detail']

const App: Component = () => {
    const [selectedTab, setSelectedTab] = createSignal(tabs[0])
    //save images
    const [images, setImages] = createSignal({
        head: [],
        eyes: [],
        eyebrows: [],
        mouth: [],
        detail: [],
    })
    //save selected indexes
    const [selectedIndex, setSelectedIndex] = createSignal({
        head: 0,
        eyes: 0,
        eyebrows: 0,
        mouth: 0,
        detail: 0,
    })
    //save selected images
    const [selectedImage, setSelectedImage] = createSignal({
        head: images().head[selectedIndex().head],
        eyes: images().eyes[selectedIndex().eyes],
        eyebrows: images().eyebrows[selectedIndex().eyebrows],
        mouth: images().mouth[selectedIndex().mouth],
        detail: images().detail[selectedIndex().detail],
    })

    const loadImage = async () => {
        //head
        const headModules = import.meta.glob<SvgImageModule>('./assets/head/*.svg')
        const fullHeadImages = await resolveImportGlobModule(headModules)

        //eyes
        const eyesModules = import.meta.glob<SvgImageModule>('./assets/eyes/*.svg')
        const fullEyesImages = await resolveImportGlobModule(eyesModules)

        //eyebrows
        const eyebrowsModules = import.meta.glob<SvgImageModule>('./assets/eyebrows/*.svg')
        const fullEyebrowsImages = await resolveImportGlobModule(eyebrowsModules)

        //mouth
        const mouthModules = import.meta.glob<SvgImageModule>('./assets/mouth/*.svg')
        const fullMouthImages = await resolveImportGlobModule(mouthModules)

        //detail
        const detailModules = import.meta.glob<SvgImageModule>('./assets/details/*.svg')
        const fullDetailImages = await resolveImportGlobModule(detailModules)

        setImages({
            head: fullHeadImages,
            eyes: ['', ...fullEyesImages],
            eyebrows: ['', ...fullEyebrowsImages],
            mouth: ['', ...fullMouthImages],
            detail: ['', ...fullDetailImages],
        })
        getRandom()
    }

    onMount(() => {
        loadImage()
    })

    let canvas: HTMLCanvasElement, canvasSize = 640

    /*
        Effect 是一种使任意代码（“副作用”）在依赖项发生变化时运行的通用方法，例如，手动修改 DOM。
        createEffect 创建一个新的计算，在跟踪范围内运行给定函数，
        从而自动跟踪其依赖关系，并在依赖关系更新时自动重新运行函数。
    */

    // Generate canvasImage
    createEffect(() => {
        // get pathToImage
        const headPath = selectedImage().head
        const eyesPath = selectedImage().eyes
        const eyebrowsPath = selectedImage().eyebrows
        const mouthPath = selectedImage().mouth
        const detailPath = selectedImage().detail
        Promise.all([
            pathToImage(headPath),
            pathToImage(eyesPath),
            pathToImage(eyebrowsPath),
            pathToImage(mouthPath),
            pathToImage(detailPath),
        ]).then(([headImage, eyesImage, eyebrowsImage, mouthImage, detailImage]) => {
            // Get canvas by ref
            // ref : 在连接到 DOM 后使用 onMount 或 createEffect 读取
            /* canvas 也可以通过赋予id获取 {
                canvas = document.getElementById('canvas') as HTMLCanvasElement
                canvas.width = canvasSize
                canvas.height = canvasSize
                }
            */
            const ctx = canvas.getContext('2d') as CanvasRenderingContext2D
            ctx.clearRect(0, 0, canvasSize, canvasSize)
            ctx.drawImage(headImage, 0, 0, canvasSize, canvasSize)
            ctx.drawImage(eyesImage, 0, 0, canvasSize, canvasSize)
            ctx.drawImage(eyebrowsImage, 0, 0, canvasSize, canvasSize)
            ctx.drawImage(mouthImage, 0, 0, canvasSize, canvasSize)
            ctx.drawImage(detailImage, 0, 0, canvasSize, canvasSize)
        })
    })

    const handleSelectItem = ({ tab, index }: { tab: string, index: number }) => {
        setSelectedIndex({ ...selectedIndex(), [tab]: index })
    }

    //get randomInt
    const randomInt = (min: number, max: number) => {
        return Math.floor(Math.random() * (max - min + 1)) + min
    }

    const getRandom = () => {
        const randomIndexes = {
            head: randomInt(0, images().head.length - 1),
            eyes: randomInt(0, images().eyes.length - 1),
            eyebrows: randomInt(0, images().eyebrows.length - 1),
            mouth: randomInt(0, images().mouth.length - 1),
            detail: randomInt(0, images().detail.length - 1),
        }
        setSelectedIndex(randomIndexes)
    }


    return (
        <>  </>
    )
}



export default App
