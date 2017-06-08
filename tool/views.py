# -*- coding: utf-8 -*-
from django.shortcuts import render
import os
import json


def home(request):
    return render(request, 'check_gamelist.html', {'init': True})


class TcObj(object):
    def __init__(self, gameId, tcFileName):
        self.gameId = gameId
        self.versions = []
        self.templates = {}
        jsonFile = open(tcFileName, "r")
        self.tcFileName = tcFileName
        data = json.load(jsonFile)
        jsonFile.close()

        print self.gameId, "============"
        if not data["games"]:
            return
        versions = data["games"][0]["versions"]
        for version in versions:
            self.versions.append(version["ver"])
        print "versions:", self.versions
        templates = data["templates"]
        for template in templates:
            pages = template["pages"]
            for page in pages:
                nodes = page["nodes"]
                for node1 in nodes:
                    for node in node1.get("nodes", [node1]):
                        params = node["params"]
                        if "gameId" not in params:
                            continue
                        gameId = str(params["gameId"])

                        version = params["version"]
                        if gameId not in self.templates:
                            self.templates[gameId] = set()
                        self.templates[gameId].add(version)

        print "templates", self.templates

    def check(self):
        res = True
        infos = []
        print "gameIds", tcObjs.keys()

        for gameId, versions in self.templates.items():
            for version in versions:
                if gameId not in tcObjs.keys():
                    res = False
                    infos.append("找不到游戏ID %s 相关配置文件!" % gameId)
                    continue
                if version not in tcObjs[gameId].versions:
                    res = False
                    infos.append(u"找不到引用游戏 %s 的版本号 %s" % (gameId, version))
        return res, infos


tcObjs = {}


def check_gamelist(request):
    global tcObjs
    tcObjs = {}
    print request.method
    print request.POST
    config_path = "/home/tyhall-difang/hall37/source/config/game/"
    config_path = "/Users/wazi/workspace-py/hall37/source/config/test/game/"
    for dirname in os.listdir(config_path):
        #if dirname not in ["7"]:
            #continue
        tcFile = config_path + dirname + "/gamelist2/tc.json"
        print tcFile
        if os.path.exists(tcFile):
            tcObj = TcObj(dirname, tcFile)
            tcObjs[dirname] = tcObj

    infos = []
    for tcObj in tcObjs.values():
        print tcObj
        res, strinfos = tcObj.check()
        if not res:
            info = {}
            info["gameId"] = tcObj.gameId
            info["info"] = strinfos
            # for i in range(len(infos)):
            # infos[i] = infos[i].decode('unicode_escape').encode('utf-8')
            infos.append(info)
    print "infos", infos

    res = True
    if not infos:
        res = True
    else:
        res = False

    # return render(request, 'check_gamelist.html', {'res': True})
    return render(request, 'check_gamelist.html',
                  {'res': res,
                   'infos': infos})


