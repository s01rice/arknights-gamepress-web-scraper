const { JSDOM } = require("jsdom");
const axios = require('axios');
const base = 'https://gamepress.gg/arknights/operator/';
const operator = 'Nian';

const fetch = async(cell) => {
    const url = base.concat(operator);

    try {
        // const { data } = await axios.get('https://gamepress.gg/arknights/tools/interactive-operator-list#tags=null##stats');
        // const dom = new JSDOM(data, {
        //     runScripts: "dangerously",
        //     resources: "usable"
        // });
        // const cell = dom.window.document.querySelectorAll(`[data-name=${operator}]`)[0];

        const { data } = await axios.get(url);
        const dom = new JSDOM(data, {
            runScripts: "dangerously",
            resources: "usable"
        });
        
        getStats (cell);
        getDetails (cell);
        
        getSkills (cell, dom);

        // getOpInfo (dom);

    } catch(error) {
        throw error;
    }

    // try {
        // const { data } = await axios.get(url);
        // const dom = new JSDOM(data, {
        //     runScripts: "dangerously",
        //     resources: "usable"
        // });
        // getOpInfo (dom);
    // } catch (error) {
    //     throw error;
    // }
};

const getStats = (cell) => {
    try {
        console.log ("Name: ", cell.getAttribute("data-name"));
        console.log ("Type: ", cell.getAttribute("data-profession"));
        console.log ("Rarity: ", parseInt(cell.getAttribute("data-rarity")));
        console.log ("ATK: ", parseInt(cell.getAttribute("data-atk-trust")));
        console.log ("Cost: ", parseInt(cell.getAttribute("data-dp-cost")));
        console.log ("Interval: ", parseFloat(cell.getAttribute("data-atk-time")));
        const icon = cell.querySelector('.operator-cell .operator-icon a img').getAttribute("src");
        console.log (icon);
    } catch(error) {
        console.log("Error: ", error);
    }
}

const getDetails = (cell) => {
    try {
        
        const traits = cell.querySelector('.traits-section').innerHTML.replace(/<center>.*<\/center>|^\s+|\s+$|<(.|\n)*?>/g, '');
        
        var talents = [];
        const talentCells = cell.querySelectorAll('.talents-section .skill-cell');

        talentCells.forEach(function (talent) {
            const talentName = talent.querySelector('.skill-title').innerHTML;
            const talentDesc = talent.querySelector('.skill-desc').innerHTML.replace(/^\s+|\s+$|<(.|\n)*?>/g, '');
            talents.push({
                name: talentName,
                desc: talentDesc
            });
        });
        console.log("Trait(s): ", traits);
        console.log("Talent(s): ", talents);
    } catch(error) {
        console.log("Error: ", error);
    }
}

const getSkills = (cell, dom) => {
    try {

        var skills = [];
        const skillCells = cell.querySelectorAll('.skills-section .skills-container .skill-cell');
        const skillIcons = dom.window.document.querySelectorAll('.skill-section .skill-cell .skill-title-cell a img');
        skillCells.forEach(function (skill, i) {
            const skillName = skill.querySelector('.skill-title').innerHTML;
            const skillIcon = skillIcons[i].getAttribute("src");
            const skillDesc = skill.querySelector('.skill-desc').innerHTML.replace(/^\s+|\s+$|<(.|\n)*?>/g, '');

            const skillSP = skill.querySelectorAll('.operaetor-list-skill-detail .skill-sp-cell .sp-info');
            const skillCost = parseInt(skillSP[0].innerHTML.match(/\d+/));
            const skillInitial = parseInt(skillSP[1].innerHTML.match(/\d+/));

            const skillDetail = skill.querySelectorAll('.operaetor-list-skill-detail .skill-detail-cell .skill-info');
            const skillChargeType = skillDetail[0].querySelector('.detail-info').innerHTML.replace(/^\s+|\s+$/g, '');
            const skillActivation = skillDetail[1].querySelector('.detail-info').innerHTML.replace(/^\s+|\s+$/g, '');
            const skillDuration = skillDetail[2].querySelector('.detail-info').innerHTML.replace(/^\s+|\s+$/g, '');

            skills.push({
                name: skillName,
                icon: skillIcon,
                desc: skillDesc,
                spCost: skillCost,
                spInitial: skillInitial,
                chargeType: skillChargeType,
                activation: skillActivation,
                duration: skillDuration
            });

        });
        console.log("Skills: ", skills);
    } catch(error) {
        console.log("Error: ", error);
    }
}

const getOpInfo = (sauce) => {
    try {
        const name = sauce.window.document.querySelector('#page-title h1').innerHTML.replace(/^\s+|\s+$/g, '');
        const type = sauce.window.document.querySelector('.profession-title').innerHTML.replace(/^\s+|\s+$/g, '');
        const rarity = sauce.window.document.querySelectorAll('.rarity-cell > img').length;

        const infos = sauce.window.document.querySelectorAll('.sub-title');
        const talentCells = sauce.window.document.querySelectorAll('.talent-cell');

        var traits;
        var talents = [];

        infos.forEach(function (field) {
            if (field.innerHTML.startsWith('Traits')) {
                traits = field.nextElementSibling.innerHTML.replace(/<small>.*|\*.*|^\s+|\s+$|<(.|\n)*?>/g, '');
            }
        });

        talentCells.forEach(function (cell) {
            const cells = cell.querySelectorAll('.talent-child');
            const length = cells.length;
            const talentName = cells[length - 1].querySelector('.talent-title').innerHTML.replace(/^\s+|\s+$/g, '');
            const talentDesc = cells[length - 1].querySelector('.talent-description').innerHTML.replace(/^\s+|\s+$|<(.|\n)*?>/g, '');
            // console.log(talentName, ": ", talentDesc);
            talents.push({name: talentName, desc: talentDesc});
        });
        
        
        console.log("Name: ", name);
        console.log("Type: ", type);
        console.log("Rarity: ", rarity);
        console.log("Trait(s): ", traits);
        console.log("Talent(s): ", talents);
    } catch (error) {
        console.log("Error: ", error);
    }
}

const uwu = async() => {
    try {
        const { data } = await axios.get('https://gamepress.gg/arknights/tools/interactive-operator-list#tags=null##stats');
        const dom = new JSDOM(data, {
            runScripts: "dangerously",
            resources: "usable"
        });
        const cell = dom.window.document.querySelectorAll(`[data-name=${operator}]`)[0];
        fetch(cell);
    }catch (error) {
        throw error;
    }

}


uwu();