class NiuArray extends Array {
    constructor(...args) {
        // 调用父类Array的constructor()
        super(...args);
        this.Container = document.querySelector("#qiniu_tm_contentfiller");
    }
    // addContainer (Container) {
    //     this.Container = Container;
    // }
    push (...args) {
        // console.log('trigger push listener');
        // 调用父类原型push方法
        super.push(...args)
        refreshList(this.Container, DATA);
        return this
    }
    splice (...args) {
        // console.log('trigger splice listener');
        // 调用父类原型push方法
        super.splice(...args)
        refreshList(this.Container, DATA);
        return this
    }
}

let labeltool = null;
// let FILENAME = null;
let DATA = new NiuArray();  //  2-way binding page data
let LIST = null;
let isNew = true;
// DATA.addContainer(document.querySelector("#qiniu_tm_contentfiller"));

window.onload = function() {
    let svgContainer = document.querySelector('#qiniu_tm_imgmarker');
    let imgContainer = document.querySelector('#qiniu_tm_img');
    labeltool = new labelTool(svgContainer, imgContainer, DATA);

    //  load list on the server
    // loadPagelocal();
    loadPageServer();

    // binding change event for image container
    document.querySelector("#qiniu_tm_imgcontainer").hidden = true;
    document.querySelector('#qiniu_tm_imgselector').addEventListener('change', function(e) {
        let imgData = window.URL.createObjectURL(e.target.files[0]);
        document.querySelector('#qiniu_tm_img').src = imgData;
        labeltool.init(imgData);

        document.querySelector("#qiniu_tm_listcontainer").hidden = true;
        document.querySelector("#qiniu_tm_imgcontainer").hidden = false;

        // let FILENAME = document.querySelector("#qiniu_tm_templatename").value;
        // let ind = odata.findIndex(e => e.fileName == FILENAME);
        // if(ind > -1) {
        //     odata[ind].data.forEach(e => DATA.push(e));
        //     setTimeout(function(){return labeltool.inputBBox(DATA)}, 1000);
        // }
    });
}

function refreshList (Container, data) {
    let tmp = '';
    data.forEach(function(datum){
        tmp +=  `<div class="card bg-light ${datum.isKey ? 'text-primary border-primary' : 'text-success border-success'} mb-3">
                    <div class="card-header">
                        ${(datum.isKey ? 'Key: ' : 'Value: ') + datum.id}
                        <button type="button" class="close" aria-label="Close">
                            <span aria-hidden="true" class="js-qiniu-tm-tab-remove" data-id="${datum.id || ''}">&times;</span>
                        </button>
                    </div>
                    <div class="card-body">
                        <div class="form-group row">
                            <label class="col-sm-2 col-form-label">名称</label>
                            <div class="col-sm-4">
                                <input type="text" class="form-control js-qiniu-tm-focus" placeholder="standard name" data-item="standard_name" data-id="${datum.id || ''}" value="${datum.standard_name || ''}" ／>
                            </div>
                            <label class="col-sm-2 col-form-label">类型</label>
                            <div class="col-sm-4">
                                <select class="custom-select js-qiniu-tm-focus"  data-id="${datum.id || ''}"  data-item="classtype" value="${datum.classtype || ''}">
                                    <option value="key" ${datum.classtype == 'key' ? 'selected':''}>关键词</option>
                                    <option value="title" ${datum.classtype == 'title' ? 'selected':''}>主标题</option>
                                    <option value="subtitle" ${datum.classtype == 'subtitle' ? 'selected':''}>副标题</option>
                                    <option value="contenttype" ${datum.classtype == 'contenttype' ? 'selected':''}>内容类型</option>
                                </select>    
                            </div>
                        </div>
                        <div class="form-group row">
                            <label class="col-sm-2 col-form-label">内容*</label>
                            <div class="col-sm-4">
                                <input type="text" class="form-control js-qiniu-tm-focus" placeholder="content" data-item="content" data-id="${datum.id || ''}" value="${datum.content || ''}" ／>
                            </div>
                            <label class="col-sm-2 col-form-label">权重</label>
                            <div class="col-sm-4">
                                <input type="number" class="form-control js-qiniu-tm-focus" name="quantity" min="1" max="5" data-item="weight" data-id="${datum.id || ''}" value="${datum.weight || 1}" />
                            </div>
                        </div>
                        <div class="form-group row">
                            <label class="col-sm-2 col-form-label">同义词</label>
                            <div class="col-sm-10">
                            <input type="text" class="form-control js-qiniu-tm-focus" placeholder="prob_names" data-item="prob_names" data-id="${datum.id || ''}" value="${datum.prob_names || ''}" ／>
                            </div>
                        </div>
                    </div>
                </div>`;
    });
    Container.innerHTML = tmp;

    document.querySelectorAll(".js-qiniu-tm-focus").forEach(ele => ele.addEventListener("focus", function(e) {
        let ind = DATA.findIndex(t => t.id == e.target.dataset.id);
        let className = DATA[ind].node.getAttribute('class') + ' qiniu-tm-selecthover-on';
        DATA[ind].node.setAttribute('class', className);
    }));

    document.querySelectorAll(".js-qiniu-tm-focus").forEach(ele => ele.addEventListener("blur", function(e) {
        let ind = DATA.findIndex(t => t.id == e.target.dataset.id);
        let className = DATA[ind].node.getAttribute('class').replace(' qiniu-tm-selecthover-on', '');
        DATA[ind].node.setAttribute('class', className);
    }));

    document.querySelectorAll(".js-qiniu-tm-focus").forEach(ele => ele.addEventListener("change", function(e) {
        let ind = DATA.findIndex(t => t.id == e.target.dataset.id);
        DATA[ind][e.target.dataset.item] = e.target.value;
    }));

    document.querySelectorAll(".js-qiniu-tm-tab-remove").forEach(ele => ele.addEventListener("click", function(e) {
        let ind = DATA.findIndex(t => t.id == e.target.dataset.id);
        DATA[ind].node.remove();
        DATA.splice(ind, 1);
    }));
}

// function loadTemplateLabels () {
//     fetch('/mockdata/data.json').then(e => e.json()).then(function(data) {
//         let tmplist = [];
//         data.key.forEach(e => tmplist.push({
//             position: e.coord,
//             standard_name: e.standard_name,
//             weight: e.weight,
//             isKey: true,
//             isTitle: e.isTitle
//         }));
        
//         data.value.forEach(e => tmplist.push({
//             bbox: e.bbox,
//             standard_name: e.standard_name,
//             weight: e.weight,
//             isKey: false,
//             isTitle: e.isTitle
//         }));
        
//         DATA = new NiuArray();
//         DATA.push(tmplist);
//     });
// }

//  binding box status
document.querySelectorAll('#qiniu_tm_detailpanel_toolbox label')[0].addEventListener("click", function(e) {
    document.querySelectorAll('polygon').forEach(e => e.removeEventListener('click', setKeyFun));
    document.querySelectorAll('polygon').forEach(e => e.removeEventListener('click', setValueFun));
});

//  binding key status
document.querySelectorAll('#qiniu_tm_detailpanel_toolbox label')[1].addEventListener("click", function(e) {
    document.querySelectorAll('polygon').forEach(e => e.addEventListener('click', setKeyFun));
    document.querySelectorAll('polygon').forEach(e => e.removeEventListener('click', setValueFun));
});

//  binding value status
document.querySelectorAll('#qiniu_tm_detailpanel_toolbox label')[2].addEventListener("click", function(e) {
    document.querySelectorAll('polygon').forEach(e => e.addEventListener('click', setValueFun));
    document.querySelectorAll('polygon').forEach(e => e.removeEventListener('click', setKeyFun));
});

function setKeyFun(e) {
    e.stopPropagation();
    e.preventDefault();
    
    let ind = DATA.findIndex(t => t.id == e.target.dataset.id);
    DATA[ind].isKey = true;
    DATA[ind].node.setAttribute('stroke', '#1E90FF');
    DATA[ind].node.setAttribute('fill', '#1E90FF');
    refreshList(document.querySelector("#qiniu_tm_contentfiller"), DATA);
}

function setValueFun(e) {
    e.stopPropagation();
    e.preventDefault();

    let ind = DATA.findIndex(t => t.id == e.target.dataset.id);
    DATA[ind].isKey = false;
    DATA[ind].node.setAttribute('stroke', '#28a745');
    DATA[ind].node.setAttribute('fill', '#28a745');
    refreshList(document.querySelector("#qiniu_tm_contentfiller"), DATA);
}


// function loadPagelocal () {
//     let data = localStorage.data ? JSON.parse(localStorage.data) : [];
//     if(data.length != 0) {
//         let tmp = data.reverse().map(datum => {return `<li class="list-group-item">
//                                             ${datum.fileName}
//                                             <button type="button" class="close" aria-label="Close">
//                                                 <span aria-hidden="true" class="js-qiniu-tm-listitem-remove" data-filename="${datum.fileName || ''}">&times;</span>
//                                             </button>
//                                         </li>`});
//         document.querySelector('#qiniu_tm_listcontainer_list ul').innerHTML = tmp.join('');
//     }
    

//     let cateSelector = localStorage.cate ? localStorage.cate : null;
//     if(cateSelector != null) {
//         document.querySelector('#qiniu_tm_cateselector').value = cateSelector;
//     }

//     document.querySelectorAll(".js-qiniu-tm-listitem-remove").forEach(ele => ele.addEventListener("click", function(e) {
//         let odata = localStorage.data ? JSON.parse(localStorage.data) : [];
//         let ind = odata.findIndex(t => t.fileName == e.target.dataset.filename);
//         odata.splice(ind, 1);
//         localStorage.data = JSON.stringify(odata);
//         location.reload();
//     }));
// }

function loadPageServer () {
    fetch('/getfilelist').then(e => e.json()).then(function(data) {
        LIST = data;
        let tmp = data.map(datum => {datum = datum.replace('.json', ''); return `<li class="list-group-item qiniu-tm-listitem-choose" data-filename="${datum || ''}">
                                            ${datum}
                                            <button type="button" class="close" aria-label="Close">
                                                <span aria-hidden="true" class="js-qiniu-tm-listitem-remove" data-filename="${datum || ''}">&times;</span>
                                            </button>
                                        </li>`});
        document.querySelector('#qiniu_tm_listcontainer_list ul').innerHTML = tmp.join('');

        document.querySelectorAll(".js-qiniu-tm-listitem-remove").forEach(ele => ele.addEventListener("click", function(e) {
            e.stopPropagation();
            e.preventDefault();
            let conf = confirm("您确定要删除这个模版吗？");
            if(conf == true) {
                let postBody = {
                    headers: { 
                        "Content-Type": "application/json"
                    },
                    method: 'POST',
                    body: JSON.stringify({'fileName': e.target.dataset.filename})
                }
    
                fetch('/removeseperate', postBody).then(function (response) {
                    console.log('response: ', response);
                    location.reload();
                });
            }
        }));

        document.querySelectorAll(".qiniu-tm-listitem-choose").forEach(ele => ele.addEventListener("click", function(e) {
            let fileName = e.target.dataset.filename;
            let postBody = {
                headers: { 
                    "Content-Type": "application/json"
                },
                method: 'POST',
                body: JSON.stringify({'fileName': fileName})
            }

            fetch('getdetail', postBody).then(e => e.json()).then(e => {
                e.data.forEach(e => DATA.push(e));
                isNew = false;
                document.querySelector('#qiniu_tm_templatename').value = fileName;
                let imgURL = '/file/imgs/' + fileName + '.png';
                document.querySelector('#qiniu_tm_img').src = imgURL;
                let promise = labeltool.init(imgURL);

                document.querySelector("#qiniu_tm_listcontainer").hidden = true;
                document.querySelector("#qiniu_tm_imgcontainer").hidden = false;

                promise.then(e => labeltool.inputBBox(DATA));
            });
            // let ind = LIST.findIndex(e => e.fileName == fileName);
            // if(ind > -1) {
            //     LIST[ind].data.forEach(e => DATA.push(e));

            //     isNew = false;
            //     document.querySelector('#qiniu_tm_templatename').value = fileName.slice(0,-4);
            //     document.querySelector('#qiniu_tm_img').src = '/file/imgs/' + fileName;
            //     let promise = labeltool.init('/file/imgs/' + fileName);

            //     document.querySelector("#qiniu_tm_listcontainer").hidden = true;
            //     document.querySelector("#qiniu_tm_imgcontainer").hidden = false;

            //     promise.then(e => labeltool.inputBBox(DATA));
            // }
        }));
    });
}

// document.querySelector('#qiniu_tm_listcontainer_upload').addEventListener('click', function(e) {
//     if(localStorage.data == undefined || localStorage.data.length == 0) return;
//     let postBody = {
//         headers: { 
//             "Content-Type": "application/json"
//         },
//         method: 'POST',
//         body: localStorage.data
//     }

//     fetch('/submit', postBody).then(function(response) {
//         console.log(response.ok);
//         if(response.ok) {
//             let cls = document.querySelector('#qiniu_tm_success_alert').getAttribute('class').replace('qiniu-tm-hidden', '');
//             document.querySelector('#qiniu_tm_success_alert').setAttribute('class', cls);
//             setTimeout(function() {
//                 let cls = document.querySelector('#qiniu_tm_success_alert').getAttribute('class') + 'qiniu-tm-hidden';
//                 document.querySelector('#qiniu_tm_success_alert').setAttribute('class', cls);
//             }, 1000);
//             console.log('update success!');
//         } else {
//             let cls = document.querySelector('#qiniu_tm_fail_alert').getAttribute('class').replace('qiniu-tm-hidden', '');
//             document.querySelector('#qiniu_tm_fail_alert').setAttribute('class', cls);
//             setTimeout(function() {
//                 let cls = document.querySelector('#qiniu_tm_fail_alert').getAttribute('class') + 'qiniu-tm-hidden';
//                 document.querySelector('#qiniu_tm_fail_alert').setAttribute('class', cls);
//             }, 1000);
//             console.log('update failed!');
//         }
        
//     }).catch(function(e) {
//         console.log(e);
//     });
// });

document.querySelector('#qiniu_tm_detailpanel_btngroup_cancel').addEventListener('click', function(e) {
    location.reload();
});

document.querySelector('#qiniu_tm_detailpanel_btngroup_submit').addEventListener('click', function(e) {
    let fileName = document.querySelector('#qiniu_tm_templatename').value;
    if(fileName.length == 0 && isNew) return;

    if(isNew) {
        let imgURL = window.URL.createObjectURL(document.querySelector('#qiniu_tm_imgselector').files[0]);
        let img = new Image();
        img.src = imgURL;
        img.onload = function() {
            let imgData = getBase64Image(img);
            // console.log(data);
            let postBody = {
                headers: { 
                    "Content-Type": "application/json"
                },
                method: 'POST',
                body: JSON.stringify({'fileName': fileName, 'data': DATA, 'imgs': imgData})
            }
    
            fetch('/submitseperate', postBody).then(function (response) {
                console.log('response: ', response);
            });
        }
    } else {
        let postBody = {
            headers: { 
                "Content-Type": "application/json"
            },
            method: 'POST',
            body: JSON.stringify({'fileName': fileName, 'data': DATA, 'imgs': ''})
        }

        fetch('/submitseperate', postBody).then(function (response) {
            console.log('response: ', response);
        });
    }
    
});

function getBase64Image(img) {
    var canvas = document.createElement("canvas");
    canvas.width = img.width;
    canvas.height = img.height;

    var ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0, img.width, img.height);

    var dataURL = canvas.toDataURL("image/png");
    // return dataURL

    return dataURL.replace("data:image/png;base64,", "");
}