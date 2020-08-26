const { JSDOM } = require("jsdom");
const axios = require('axios');
const base = 'https://gamepress.gg';
const server = 'na';
var dataArray = [];

const yoink = async (opCell, href) => {
    const url = base.concat(href);

    try {
        const { data } = await axios.get(url);
        const opPage = new JSDOM(data, {
            runScripts: "dangerously",
            resources: "usable"
        });
        
        var opObject = {
            name: opCell.getAttribute("data-name"),
            icon: opCell.querySelector('.operator-cell .operator-icon a img').getAttribute("src"),
            stats: getStats (opCell),
            traits: getTraits (opCell),
            talents: getTalents (opCell),
            skills: getSkills (opCell, opPage)
        };        

        // console.log (opObject);
        dataArray.push (opObject);
        return;
    } catch(error) {
        throw error;
    }
};

const getStats = (opCell) => {
    try {
        var stats = {
            type: opCell.getAttribute("data-profession"),
            rarity: parseInt(opCell.getAttribute("data-rarity")),
            hp: parseInt(opCell.getAttribute("data-hp-trust")),
            atk: parseInt(opCell.getAttribute("data-atk-trust")),
            def: parseInt(opCell.getAttribute("data-def-trust")),
            cost: parseInt(opCell.getAttribute("data-dp-cost")),
            res: parseInt(opCell.getAttribute("data-res")),
            block: parseInt(opCell.getAttribute("data-block")),
            interval: parseFloat(opCell.getAttribute("data-atk-time"))
        };

        return stats;
    } catch(error) {
        console.log("Error: ", error);
    }
}

const getTraits = (opCell) => {
    try {
        const traits = opCell.querySelector('.traits-section').innerHTML.replace(/<center>.*<\/center>|^\s+|\s+$|<(.|\n)*?>/g, '');
        // console.log ("Trait(s): ", traits);

        return traits;
    } catch(error) {
        console.log("Error: ", error);
    }

}

const getTalents = (opCell) => {
    try {
        var talents = [];
        const talentCells = opCell.querySelectorAll('.talents-section .skill-cell');

        for (const talent of talentCells) {
            
            const talentName = talent.querySelector('.skill-title').innerHTML;
            const talentDesc = talent.querySelector('.skill-desc').innerHTML.replace(/^\s+|\s+$|<(.|\n)*?>/g, '');
            talents.push({
                name: talentName,
                desc: talentDesc
            });
        }
        
        return talents;
    } catch(error) {
        console.log("Error: ", error);
    }
}

const getSkills = (opCell, opPage) => {
    try {

        var skills = [];
        const skillCells = opCell.querySelectorAll('.skills-section .skills-container .skill-cell');
        const skillIcons = opPage.window.document.querySelectorAll('.skill-section .skill-cell .skill-title-cell a img');
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
        
        return skills;
    } catch(error) {
        console.log("Error: ", error);
    }
}

const uwu = async () => {
    try {
        const { data } = await axios.get('https://gamepress.gg/arknights/tools/interactive-operator-list#tags=null##stats');
        const dom = new JSDOM(data, {
            runScripts: "dangerously",
            resources: "usable"
        });
        const opCells = dom.window.document.querySelectorAll(`[data-availserver=${server}][data-rarity="6"][data-profession="Defender"]`);
        
        for (const [i, opCell] of opCells.entries()) {
            process.stdout.write(`Fetching operator ${i + 1} of ${opCells.length} ... `);
            const href = opCell.querySelector('.operator-cell .operator-title a').getAttribute("href");
            await yoink(opCell, href);
            process.stdout.write("complete.\n");
        }

        // const href = opCells[0].querySelector('.operator-cell .operator-title a').getAttribute("href");
        // var x = await yoink(opCells[0], href);
        // console.log(x);
        // dataArray.push(x);
        console.log(JSON.stringify(dataArray, null, "\t"));

    }catch (error) {
        throw error;
    }
    return;
}

uwu();