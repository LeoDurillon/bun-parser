// @bun
class J{static argNotFound(q){return Error(`${q?q+" a":"A"}rguments not found\n`)}static wrongType(q,y,B){return Error(`${B?B+" w":"W"}rong type expected ${q} found ${y}\n`)}static missingValue(q){return Error(`${q?q+" i":"I"}s required\n`)}static missingPath(){return Error("An argument for path was expected but found nothing")}}class M{name;type;short;description;required;constructor(q){this.name=q.name,this.type=q.type,this.short=q.short,this.description=q.description,this.required=q.required}checkType(q){return this.type==="number"?this.checkNumber(q):this.checkString(q)}checkExists(q){if(!this.required)return!0;if(!q[this.name.slice(2)])throw J.missingValue(this.name);return!0}checkNumber(q){const y=Number(q);if(isNaN(y))throw J.wrongType(this.type,typeof q,this.name);return y}checkString(q){if(typeof q!=="string")throw J.wrongType(this.type,typeof q,this.name);if(q.length<1)throw J.missingValue(this.name);return q.replaceAll('"',"").replaceAll("'","")}}class L{name;description;args;place;separator;schema;help;path;value;constructor({name:q,description:y,help:B,path:D,separator:F,schema:G}){this.name=q,this.description=y,this.args=Bun.argv.slice(D&&![B?.name,B?.short].includes(Bun.argv[2])?3:2),this.place=`${process.cwd()}${D?"/"+Bun.argv[2]:""}`,this.separator=F??"=",this.schema=Object.keys(G).map((K)=>new M({name:"--"+K,...G[K]})),this.path=D??!1,this.help=B,this.value=this.parse()}parse(){if(this.help&&(this.args.includes(this.help.name)||this.args.includes(this.help.short)))return this.helper();const q=Object();for(let y of this.args){const[B,D]=y.split(this.separator),F=this.schema.find((G)=>G.name===B);if(!F)throw J.argNotFound(B);if(F.type!=="boolean"){const G=F.checkType(D);q[F.name.slice(2)]=G}else q[F.name.slice(2)]=!0}return this.schema.every((y)=>y.checkExists(q)),{path:this.place,values:q}}helper(){const q=this.help,y=this.args.flatMap((D)=>D.split(this.separator)).filter((D)=>D.includes("--"));let B=y.indexOf(q.name);if(B<0&&q.short)B=y.indexOf(q.short);if(B>0){const D=y.slice(0,B),F=[];for(let G of D){const K=this.schema.find((O)=>O.name===G);if(!K)throw J.argNotFound(G);F.push(K)}return F.map((G)=>this.message(G)).join("\n")}else{const D=this.schema.map((F)=>this.message(F));return`${this.name?`Program : ${this.name}\n`:""}${this.description?`Description : ${this.description}\n`:""}Separator : ${this.separator}\n\nHelp args : ${q.name}${q.short?" & "+q.short:""}\n\nbunx ${this.name?this.name:""} ${this.path?"[PATH] ":""}[OPTION]\n\nOption :\n${D.join("\n")}`}}message(q){return`|Name : ${q.name}\n${q.short?`|Short : ${q.short}\n`:""}${q.description?`|Description : 
      ${q.description}\n`:""}|Type : ${q.type}\n|Required : ${q.required?"Yes":"No"}\n|Example : ${q.name}${q.type!=="boolean"?`${this.separator}${q.type==="number"?3:'"exemple"'}`:""}\n`}getValue(){if(typeof this.value==="string")Bun.write(Bun.stdout,this.value);return this.value}static generate(q){return new L(q).getValue()}}var $=L;export{$ as default};