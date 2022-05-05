import json
import os
import random
import re
import sys
import time

import geoip2.database
import requests
from bson import ObjectId
from flask import Flask, render_template, render_template_string, request, redirect, stream_with_context, Response

# from chglinkalpha import chglink
from markdown import markdown
# from transalpha import init_trans

# from pymongo import MongoClient

if sys.platform.startswith('linux'):
    markdown_dir = '/srv/www/owncloud/index/markdown/'
    static_dir = '/srv/www/owncloud/index/static_files/'

    ip_dir = '/srv/www/owncloud/index/geoipdb/'

    # static_url_path = '/static_file'
    app = Flask(__name__)
else:
    markdown_dir = 'markdown/public/'
    static_dir = 'static_files/'

    ip_dir = 'geoipdb/'

    static_url_path = '/index/static_files'
    app = Flask(__name__, static_url_path=static_url_path, static_folder='static_files')


# client = MongoClient("mongodb://user:password@8.130.172.78")
# db = client.bot90
# clc = db.test


def show_md_list():
    md_list = ''

    for md in os.listdir(markdown_dir):
        modified_time = os.stat(os.path.realpath(markdown_dir) + '/' + md).st_mtime
        file_modify_time = time.strftime('%Y-%m-%d %H:%M:%S', time.localtime(modified_time))
        with open(markdown_dir + md, "r", encoding="utf-8") as input_file:
            text = input_file.read().split('\n')
        # 以下为文章列表中描述的内容
        desc = ''
        n = 2
        while len(desc) < 750 and n <= len(text) - 2:
            desc = desc + text[n]
            n = n + 1
        md_list = '<a class="mdhref" title="' + text[0][2:] + '" href="/index/notes/' + md[:-3] \
                  + '"><div class="mdtitle"><i class="fa-regular fa-file-lines"></i>&nbsp;' + text[0][2:] \
                  + '</div><div class="mddesc">' \
                  + desc + '</div><div class="mdlm"><i class="fa-regular fa-calendar-plus"></i>&nbsp;Last Modified: ' \
                  + file_modify_time + '</div></a><hr>' + md_list
    md_list = md_list + '<div style="text-align: center; color: #00f;">已经滚动到页面最底部了哦</div>'
    return md_list


def show_footer_ip():
    ip = request.remote_addr
    # print(ip)
    try:
        response_str = ''
        with geoip2.database.Reader(f'{ip_dir}GeoLite2-City.mmdb') as reader:
            response = reader.city(ip)
        response_str = response_str + response.country.names['zh-CN'] + response.subdivisions.most_specific.names[
            'zh-CN'] + response.city.names['zh-CN']
        with geoip2.database.Reader(f'{ip_dir}GeoLite2-ASN.mmdb') as reader:
            response = reader.asn(ip)
        response_str = response_str + response.autonomous_system_organization
        response_str += f'(ip:{ip})'
        return f'<a href="/index/ip?ip={ip}"><i class="fa-solid fa-location-dot"></i>&nbsp;' + response_str \
               + '</a>'
    except:
        return f'<a href="/index/ip?ip={ip}"><i class="fa-solid fa-location-dot"></i>&nbsp;the unknown area(ip:{ip})</a>' \
               + '<div style=\"display: none;\">' \
               + '<br>app.static_url_path: ' + str(app._static_url_path) \
               + '<br>app.static_folder:   ' + str(app._static_folder) \
               + '<br>sys.platform:    ' + sys.platform \
               + '<br>url_for:         ' + render_template_string('{{ url_for(\'static\', filename = \'hello.js\') }}') \
               + '</div>'


@app.route('/static_files/<path:path_name>')
def static_handler(path_name):
    with open(f'{static_dir}{path_name}', 'rb') as f:
        content = f.read()

    if path_name.split('.')[-1] == 'js':
        content_type = 'text/javascript; charset=utf-8'
    elif path_name.split('.')[-1] == 'css':
        content_type = 'text/css; charset=utf-8'
    elif path_name.split('.')[-1] == 'png':
        content_type = 'image/png'
    elif path_name.split('.')[-1] == 'ico':
        content_type = 'image/x-icon'
    elif path_name.split('.')[-1] == 'woff2':
        content_type = 'font/woff2'
    else:
        content_type = 'application/octet-stream'
    return content, 200, {
        'Content-Type': content_type
    }


@app.route('/')
@app.route('/index')
def rewrite():
    return '<script>window.location.href = \'/index/home\'</script>'


@app.route('/home')
@app.route('/index/home')
def root_folder():
    return render_template('indextemp.html', mdlist=show_md_list(), footerip=show_footer_ip())


@app.route('/s')
@app.route('/index/s')
def search_route():
    return render_template('resulttemp.html', footerip=show_footer_ip())


@app.route('/result')
@app.route('/index/result')
def show_result():
    query = request.args.get('q')
    # 转义正则表达式的特殊字符
    query = re.sub(r"([\\$()*+.\[?^{|])", r'\\\1', query)

    column = request.args.get('column')
    page = request.args.get('page')

    if not all([query, page]):
        return '参数不完整'
    elif column:
        if int(column) > 6:
            return '请求参数非法'

    if page == '1':
        res = clc.find({'$or': [{'title': {'$regex': query, '$options': '$i'}},
                                {'description': {'$regex': query, '$options': '$i'}}]})
        ret = {'page': 1, 'res': []}
        for i in res:
            ret['res'].append({
                'id': str(i['_id']),
                'title': i['title'],
                'description': str(i['description']).replace('\n', '').replace('\r', ' '),
                'href': i['href']
            })
        return json.dumps(ret, ensure_ascii=False), 200, {'Content-Type': 'application/json; charset=utf-8'}
    else:
        return '结果未找到', 404


@app.route('/go/<obj_id>')
@app.route('/index/go/<obj_id>')
def go(obj_id):
    try:
        detail = clc.find({'_id': ObjectId(obj_id)})
    except:
        return render_template_string(
            '<p style="font-size: 60px; color: rgb(255, 0, 0); background-color: rgb(255, 222, 222); text-align: '
            'center">无请求参数或请求参数非法<p>'), 404
    return redirect(detail[0]['href'])


@app.route('/detail')
@app.route('/index/detail')
def show_detail():
    return render_template('detailtemp.html', footerip=show_footer_ip())


@app.route('/detdes')
@app.route('/index/detdes')
def det_des():
    try:
        oid = request.args.get('oid')
        detail = clc.find({'_id': ObjectId(oid)})
        post = {'_id': {'$oid': str(detail[0]['_id'])}, 'title': detail[0]['title'],
                'description': str(detail[0]['description']).replace('\n', '').replace('\r', ' '),
                'href': detail[0]['href']}
    except:
        return render_template_string(
            '<p style="font-size: 60px; color: rgb(255, 0, 0); background-color: rgb(255, 222, 222); text-align: '
            'center">无请求参数或请求参数非法<p>'), 404
    return json.dumps(post, ensure_ascii=False), 200, {'Content-Type': 'application/json; charset=utf-8'}


@app.route('/notes')
@app.route('/index/notes')
def article_list():
    return render_template('articletemp.html', mdlist=show_md_list(), footerip=show_footer_ip())


@app.route('/notes/<int:atc_id>')
@app.route('/index/notes/<int:atc_id>')
def show_atc(atc_id):
    try:
        with open(markdown_dir + str(atc_id) + ".md", "r", encoding="utf-8") as input_file:
            text = input_file.read()
        stdin = markdown(text, extensions=['codehilite'])
        return render_template('mdtemp.html', stdin=stdin, footerip=show_footer_ip())
    except:
        return render_template('mdtemp.html', footerip=show_footer_ip(),
                               stdin='<p style="font-size: 60px; color: rgb(255, 0, 0); background-color: rgb(255, '
                                     '222, 222); text-align: center">Error 404 : 找不到请求的内容<p>'), 404


@app.route('/fanyi')
@app.route('/index/fanyi')
def trans():
    try:
        url = request.args.get('url')
        return chglink(url, init_trans(url))
    except:
        return render_template_string(
            '<p style="font-size: 60px; color: rgb(255, 0, 0); background-color: rgb(255, 222, 222); text-align: '
            'center">Error 404<br>/fanyi:无请求参数或请求参数非法<p>'), 404


@app.route('/proxy')
@app.route('/index/proxy')
def proxy():
    try:
        url = request.args.get('url')
        ua = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/' + str(
            random.randint(70, 92)) + '.0.' + str(random.randint(1000, 9999)) + '.' + str(
            random.randint(10, 999)) + ' Safari/537.36'
        print(50 * ' ' + '正在尝试访问' + url)
        with requests.get(url, headers={'User-agent': ua}) as response:
            # print(response.headers)
            # return response.text, 200, {'Content-Type': response.headers['Content-Type']}
            return Response(stream_with_context(response.iter_content()), content_type=response.headers['content-type'])
    except:
        return render_template_string(
            '<p style="font-size: 60px; color: rgb(255, 0, 0); background-color: rgb(255, 222, 222); text-align: '
            'center">Error 404<br>/proxy:无请求参数或请求参数非法<p>'), 404


@app.route('/links')
@app.route('/index/links')
def show_links():
    return render_template('links_temp.html', footerip=show_footer_ip())


@app.errorhandler(404)
def page_unauthorized(error):
    return render_template('error.html', error_info=error, footerip=show_footer_ip(), error_code='404'), 404


@app.errorhandler(500)
def page_unauthorized(error):
    return render_template('error.html', error_info=error, footerip=show_footer_ip(), error_code='500'), 500


def main():
    app.run(debug=True, port=5000, host='0.0.0.0')


if __name__ == '__main__':
    main()
