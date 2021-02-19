import axios from 'axios';

const { log } = console;

// 给不同的环境配置不同的请求地址 根据 `process.env.NODE_ENV`配置不同的`baseURL`,使项目只需执行相应的打包命令，就可以在不同环境中自动切换请求主机地址。

const setBaseURL = (env) => {
    let base = {
        production: '/',
        development: 'http://localhost:3000',
        test: 'http://localhost:3001'
    }[env];

    if (!base) {
        base = '/';
    }
    
    return base;
};


class CustomAxios {
    constructor () {
        // 动态获取 url
        this.baseURL = setBaseURL(process.env.NODE_ENV);

        // 配置超时
        this.timeout = 10000;

        // 配置允许跨域携带凭证
        this.withCredentials = true;
 
    }

    /**
     * 给这个类创建实例上的方法request
     * 在 request 方法里，创建新的axios实例，接收请求配置参数，处理参数，添加配置，返回axios实例的请求结果（一个promise对象）。
     * 你也可以不创建，直接使用默认导出的axios实例，然后把所有配置都放到它上面，不过这样一来整个项目就会共用一个axios实例。虽然大部分项目下这样够用没问题，但是有的项目中不同服务地址的请求和响应结构可能完全不同，这个时候共用一个实例就没办法支持了。所以为了封装可以更通用，更具灵活性，我会使用axios的create方法，使每次发请求都是新的axios实例。
     */
    request (options) {
        // 每次请求都会创建新的axios实例
        const instance = axios.create();

        // 将用户传过来的参数与公共配置合并
        const config = {
            ...options,
            baseURL: this.baseURL,
            timeout: this.timeout,
            withCredentials: this.withCredentials
        };

        // 配置拦截器，根据不同的url配置不同的拦截器
        this.setInterceptors (instance, options.url);
        return instance(config);
    }

    // 这里的 url 可供你针对需求特殊处理的接口路径设置不同拦截器
    setInterceptors = (instance, url) => {
        
        // 请求拦截器
        instance.interceptors.request.use((config) => {
            
            // 配置 token
            config.headers.AuthorizationToken = localStorage.getItem('AuthorizationToken') || '';
        
            config.url=url+'?userId='+sessionStorage.getItem('userId');
            return config;
        }, err => Promise.reject(err));

        // 响应拦截器
        instance.interceptors.response.use((response) =>  {
            // todo: 想根据业务需要，对响应结果预先处理的，都放在这里
            log('todo: 想根据业务需要，对响应结果预先处理的，都放在这里');
            return response;
        }, (err) => {
            
            // 响应错误码处理
            if (err.response) {
                log(err.response);
                switch (err.response.status) {
                    case 403:
                        log('响应错误码处理-403');
                        break;
                    case '500':
                        log('响应错误码处理-500');
                        break;
                    case 404:
                        log('响应错误码处理-404');
                    default:
                        log('响应错误码处理');
                }
                return Promise.reject(err.response);
            }

            // 断网处理
            if (!window.navigator.onLine) {
                // todo: jump to offline page
                return -1;
            }
            return Promise.reject(err);
        });
    }
}

export default new CustomAxios();