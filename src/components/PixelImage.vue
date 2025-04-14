<template>
    <v-card class="card">
        <div class="top-title-div">
            图片像素风格化
        </div>
        <v-select label="风格化类型" density="compact" variant="outlined" :items="itemTypes"
            v-model="itemType"></v-select>
        <div class="col-div">
            <v-slider v-if="this.itemType=='黑白'||this.itemType=='黑白(反转)'||this.itemType=='彩色'" 
                v-model="width" :max="oriWidth" :step="1" :min="4" :color="themeColor" style="width: 100%;"
                label="图像宽度" hide-details>
                <template v-slot:append>
                    <v-text-field v-model="width" density="compact" style="width: 100px" type="number"
                        variant="outlined" hide-details></v-text-field>
                </template>
            </v-slider>
            <v-slider v-if="this.itemType=='黑白'||this.itemType=='黑白(反转)'||this.itemType=='彩色'" 
                v-model="height" :max="oriHeight" :step="1" :min="4" :color="themeColor" label="图像高度"
                style="width: 100%;" hide-details>
                <template v-slot:append>
                    <v-text-field v-model="height" density="compact" style="width: 100px" type="number"
                        variant="outlined" hide-details></v-text-field>
                </template>
            </v-slider>
            <v-slider v-if="this.itemType=='黑白'||this.itemType=='黑白(反转)'||this.itemType=='彩色'" 
                v-model="pixelSize" :max="50" :step="1" :min="1" :color="themeColor" label="像素块大小"
                style="width: 100%;" hide-details>
                <template v-slot:append>
                    <v-text-field v-model="pixelSize" density="compact" style="width: 100px" type="number"
                        variant="outlined" hide-details></v-text-field>
                </template>
            </v-slider>
            <v-slider v-if="this.itemType=='文本'||this.itemType=='文本(反转)'" 
                v-model="textRowNum" :max="50" :step="1" :min="1" :color="themeColor" label="行数"
                style="width: 100%;" hide-details>
                <template v-slot:append>
                    <v-text-field v-model="textRowNum" density="compact" style="width: 100px" type="number"
                        variant="outlined" hide-details></v-text-field>
                </template>
            </v-slider>
            <v-slider v-if="this.itemType=='文本'||this.itemType=='文本(反转)'" 
                v-model="textColNum" :max="50" :step="1" :min="1" :color="themeColor" label="列数"
                style="width: 100%;" hide-details>
                <template v-slot:append>
                    <v-text-field v-model="textColNum" density="compact" style="width: 100px" type="number"
                        variant="outlined" hide-details></v-text-field>
                </template>
            </v-slider>
            <v-btn @click="convert" variant="outlined" :color="themeColor" width="100%"
                :loading="loading"
                style="margin: 10px;font-weight: bold;">转换</v-btn>
        </div>
        <div class="row-div">
            <div class="col-div">
                <v-btn variant="text" @click="selectImage">上传原图像</v-btn>
                <image-card :width="200" :src="oriImageUrl"></image-card>
            </div>
            <div v-if="this.itemType=='黑白'||this.itemType=='黑白(反转)'||this.itemType=='彩色'"  class="col-div">
                <div class="medium-text-div">
                    转换后图像
                </div>
                <image-card v-if="styleImageUrl != null" :width="200" :src="styleImageUrl"></image-card>
            </div>
        </div>
        <div class='text-img-container'>
            <div v-if="this.itemType=='文本'||this.itemType=='文本(反转)'" class="text-display">
                {{ this.imgText }}
            </div>
        </div>
        <v-btn v-if="(this.itemType=='黑白'||this.itemType=='黑白(反转)'||this.itemType=='彩色')&&styleImageUrl != null" @click="saveImage" variant="outlined" :color="themeColor" width="100%" style="margin: 10px;font-weight: bold;" prepend-icon="mdi-download">保存图片</v-btn>
        <v-btn v-if="(this.imgText)&&this.itemType=='文本'||this.itemType=='文本(反转)'" @click="copyText" variant="outlined" :color="themeColor" width="100%" style="margin: 10px;font-weight: bold;" prepend-icon="mdi-download">复制到剪贴板</v-btn>
    </v-card>
</template>
<script>
import { globalProperties } from '@/main';
import ImageCard from './ImageCard.vue';
import { convertImageToText, convertToPixelatedBW, convertToPixelatedColor } from '@/algorithm/alg';
import { ref } from 'vue';

export default {
    setup() {
        const themeColor = globalProperties.$themeColor;
        const itemTypes=['黑白', '彩色','黑白(反转)','文本','文本(反转)'];
        const loading=ref(false);
        const setLoadingState=(state)=>{
            loading.value=state;
        }
        return {
            loading,
            themeColor,
            itemTypes,
            setLoadingState,
        }
    },
    components: {
        ImageCard,
    },
    data() {
        return {
            itemType: '黑白',
            oriImage: null,
            oriImageUrl: null,
            styleImageUrl: null,
            styleImage: null,
            width: 512,
            height: 512,
            pixelSize: 5,
            oriHeight: 1024,
            imgText:null,
            oriWidth: 1024,
            textColNum:32,
            textRowNum:18,
        }
    },
    methods: {
        selectImage() {
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = 'image/png, image/jpeg, image/jpg';
            input.onchange = (event) => {
                const file = event.target.files[0];
                if (file) {
                    const validTypes = ['image/png', 'image/jpeg', 'image/jpg'];
                    if (validTypes.includes(file.type)) {
                        const objectUrl = URL.createObjectURL(file);
                        const img = new Image();
                        img.onload = () => {
                            this.oriImage = file;
                            this.oriImageUrl = objectUrl;
                            this.oriWidth = img.width;
                            this.oriHeight = img.height;
                            this.width = img.width;
                            this.height = img.height;
                            this.styleImage = null;
                            this.styleImageUrl = null;
                        }
                        img.onerror = () => {
                            window.alert('图片加载失败，请选择其他图片');
                            URL.revokeObjectURL(objectUrl);
                        };
                        img.src = objectUrl;
                    } else {
                        window.alert('请选择正确的图片格式（PNG、JPEG、JPG）');
                    }
                }
            };

            input.click();
        },
        async convert() {
            if(this.loading){
                return;
            }
            if (this.oriImage == null || this.oriImageUrl == null) {
                window.alert('请选择原图像');
                return;
            }
            if (this.pixelSize > this.width || this.pixelSize > this.height) {
                window.alert('像素块大小不能大于图像尺寸');
                return;
            }
            let bwImg=null;
            this.setLoadingState(true);
            switch(this.itemType){
                case '黑白':
                    this.styleImage = await convertToPixelatedBW(this.oriImage, this.width, this.height, this.pixelSize);
                    this.styleImageUrl = URL.createObjectURL(this.styleImage);
                    break;
                case '黑白(反转)':
                    this.styleImage = await convertToPixelatedBW(this.oriImage, this.width, this.height, this.pixelSize, true);
                    this.styleImageUrl = URL.createObjectURL(this.styleImage);
                    break;
                case '彩色':
                   this.styleImage = await convertToPixelatedColor(this.oriImage,this.width,this.height,this.pixelSize);
                   this.styleImageUrl = URL.createObjectURL(this.styleImage);
                   break;
                case '文本':
                    bwImg=await convertToPixelatedBW(this.oriImage, this.width, this.height, 1);
                    this.imgText=await convertImageToText(bwImg,this.textRowNum,this.textColNum);
                    break;
                case '文本(反转)':
                    bwImg=await convertToPixelatedBW(this.oriImage, this.width, this.height, 1, true);
                    this.imgText=await convertImageToText(bwImg,this.textRowNum,this.textColNum);
                    break;
            }
            this.setLoadingState(false);
        },
        saveImage() {
            const a = document.createElement('a');
            a.href = this.styleImageUrl;
            a.download = Date.now().toString()+'.jpg';
            document.body.appendChild(a);
            a.click();
        },
        async copyText(){
            await navigator.clipboard.writeText(this.imgText)
        }
    },
    mounted() {

    }
}
</script>
<style scoped>
.top-title-div {
    font-size: 18px;
    font-weight: bold;
    width: 100%;
    display: flex;
    flex-direction: row;
    justify-content: center;
}

.medium-text-div {
    font-size: 16px;
    width: 100%;
    display: flex;
    flex-direction: row;
    justify-content: center;
    margin: 5px;
}
.text-display{
    margin: 5px;
    white-space: pre-line;
        word-break: break-all;
        overflow: hidden;
        line-height: 1.2;
        display: -webkit-box;
        -webkit-box-orient: vertical;
}
.text-img-container{
    display: flex;
    flex-direction: column;
    overflow-y: scroll;
}
.small-text-div {
    font-size: 14px;
    width: 100%;
    display: flex;
    flex-direction: row;
    justify-content: center;
    margin: 5px;
    font-weight: bold;
    color: grey;
}

.row-div {
    display: flex;
    height: fit-content;
    flex-direction: row;
    justify-content: center;
}

.col-div {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    margin: 5px;
}

@media screen and (min-width: 600px) {
    .card {
        margin: 20px;
        width: 750px;
        max-height: 800px;
        padding: 20px;
        overflow: scroll;
    }

    .column-div-scroll {
        display: flex;
        flex-direction: column;
        max-height: 650px;
        overflow: auto;
    }
}

@media screen and (max-width: 600px) {
    .card {
        margin: 20px;
        max-height: 90vh;
        padding: 15px;
        overflow: scroll;
    }

    .column-div-scroll {
        display: flex;
        flex-direction: column;
        max-height: 80vh;
        overflow: auto;
    }
}
</style>