import{r as l,d as t,h as d}from"./p-b6e44a24.js";const s=class{constructor(d){l(this,d),this.mismatchedPixels=null,this.diffNavChange=t(this,"diffNavChange",7)}navToDiff(l){l.preventDefault(),l.stopPropagation(),this.diffNavChange.emit(this.diff.id)}render(){const l=this.diff,t="number"==typeof this.mismatchedPixels,s=t?this.mismatchedPixels/(l.width*l.deviceScaleFactor*(l.height*l.deviceScaleFactor)):null;let n="";t?this.mismatchedPixels>0&&(n="has-mismatch"):n="not-calculated";const i=l.testPath.split("/");i.pop();const a=i.join("/");return[d("p",{class:"test-path"},l.testPath),d("dl",null,d("div",null,d("dt",null,"Diff"),d("dd",null,d("a",{href:"#diff-"+l.id,onClick:this.navToDiff.bind(this)},l.id))),l.comparable?[d("div",{class:n},d("dt",null,"Mismatched Pixels"),d("dd",null,t?this.mismatchedPixels:"--")),d("div",{class:n},d("dt",null,"Mismatched Ratio"),d("dd",null,t?s.toFixed(4):"--"))]:null,d("div",null,d("dt",null,"Device"),d("dd",null,l.device)),d("div",null,d("dt",null,"Width"),d("dd",null,l.width)),d("div",null,d("dt",null,"Height"),d("dd",null,l.height)),d("div",null,d("dt",null,"Device Scale Factor"),d("dd",null,l.deviceScaleFactor)),l.imageA?d("div",null,d("dt",null,"Left Preview"),d("dd",null,d("a",{href:`/data/tests/${this.aId}/${a}/`,target:"_blank"},"HTML"))):null,l.imageB?d("div",null,d("dt",null,"Right Preview"),d("dd",null,d("a",{href:`/data/tests/${this.bId}/${a}/`,target:"_blank"},"HTML"))):null,d("div",{class:"desc"},d("dt",null,"Description"),d("dd",null,l.desc)))]}static get style(){return".test-path{margin-top:0;padding-top:0;font-size:10px;color:var(--analysis-data-color)}dl{padding:0;margin:0;font-size:var(--analysis-data-font-size);line-height:28px}div{display:-ms-flexbox;display:flex;width:260px}dt{-ms-flex:2;flex:2;font-weight:500}dd,dt{display:inline}dd{-ms-flex:1;flex:1;color:var(--analysis-data-color)}.desc,.desc dd,.desc dt{display:block}.desc dd{margin:0;line-height:22px}.not-calculated dd{color:#ccc}.has-mismatch dd{color:#ff6200}p{padding-top:14px;font-size:var(--analysis-data-font-size)}a{color:var(--analysis-data-color)}a:hover{text-decoration:none}"}};export{s as compare_analysis};